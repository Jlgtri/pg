import { CacheCommonService } from '@libs/cache';
import { HOLDING_DAYS, MIN_BALANCE_USD } from '@libs/constants';
import { SnapshotUserInfoEntity, UserEntity } from '@libs/db';
import { DebankApiService } from '@libs/debank';
import { ChainId } from '@libs/debank/constants/common.constants';
import { TokensListResponse } from '@libs/debank/types/dabant.types';
import { GoldrushChains } from '@libs/goldrush/index';
import { ApiService as GoldrushApiService } from '@libs/goldrush/services';
import { BotTelegramService, PROVIDE_BOT } from '@libs/telegram';
import {
  delay,
  getLastProjectStartDate,
  getRewardCoeff,
  getStageOfCheckIn,
  isAddressesEqual,
  toLower
} from '@libs/utils';
import { Inject, Logger } from '@nestjs/common';
import Big from 'big.js';
import CONFIG from 'config';
import {
  addHours,
  addMinutes,
  addSeconds,
  differenceInDays,
  format,
  startOfDay,
  subDays
} from 'date-fns';
import _ from 'lodash';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { Holder } from '../types/holder.types';
import { UsersRewardsSnapshotsService } from './users-rewards-snapshots.service';

export class RewardsSnapshotsService {
  @Inject() private dataSource: DataSource;
  @Inject() private goldrushApiService: GoldrushApiService;
  @Inject() private debankApiService: DebankApiService;
  @Inject() private cacheCommonService: CacheCommonService;
  @Inject() private usersRewardsSnapshotsService: UsersRewardsSnapshotsService;
  @Inject(PROVIDE_BOT) private botTelegramService: BotTelegramService;

  private logger = new Logger(RewardsSnapshotsService.name);

  async onApplicationBootstrap() {
    // 1. local do fillSnapshotsBeforeStartProject
    // 2. dumb to prod
    // 3. rm fillSnapshotsBeforeStartProject
    // await this.fillSnapshotsBeforeStartProject();
  }

  async checkIn(wallet: string) {
    try {
      const user = await this.dataSource.manager.findOneBy(UserEntity, {
        walletAddress: wallet,
      });
      if (!user) {
        return {
          success: false,
          text: 'User not found',
        };
      }
      if (!user.existsXTweet) {
        return {
          success: false,
          text: 'No tweet',
        };
      }
      const currentStage = getStageOfCheckIn();
      if (currentStage <= 0) {
        return {
          success: false,
          text: 'To early',
        };
      }
      const lastSnapshot = await this.#getUserLastSnapshotByWallet(
        user.walletAddress,
      );
      if (lastSnapshot && lastSnapshot.checkInStages.includes(currentStage)) {
        return {
          success: false,
          text: `Check in exists`,
        };
      }
      const date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      // TODO need rate limiter
      // await delay(300);
      const tokens = await this.debankApiService.getAllTokensList(
        user.walletAddress,
      );
      if (!tokens) {
        return {
          success: false,
          text: `Try later`,
        };
      }
      const { totalBalance, pepeBalance } = tokens.reduce(
        (acc, { id, price, amount, chain }) => {
          acc.totalBalance = price * amount + acc.totalBalance;
          if (
            chain === ChainId.Bsc &&
            isAddressesEqual(id, CONFIG.MAIN_TOKEN.ADDRESS)
          ) {
            acc.pepeBalance = acc.pepeBalance + amount;
          }
          return acc;
        },
        {
          totalBalance: 0,
          pepeBalance: 0,
        },
      );
      const snapshot = await this.updateHolderRewardsSnapshot(
        {
          address: user.walletAddress,
          balance: pepeBalance,
          balanceUsd: totalBalance,
        },
        date,
      );
      await this.usersRewardsSnapshotsService.linkUserWithSnapshots(user.id);
      await this.cacheCommonService.clearAllCaches();
      if (snapshot) {
        await this.#sendTelegramMessage(user, snapshot, tokens);
      }
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      this.logger.error('Error on checkIn', {
        ...error,
      });
    }
  }

  // remove after fill on prod
  async fillSnapshotsBeforeStartProject() {
    try {
      const days = Object.values(HOLDING_DAYS).sort((a, b) => b - a);
      const now = new Date();
      this.logger.verbose('Start to update');
      let amountOfDays = 1;
      for (const [i, day] of days.entries()) {
        let pageNumber = 0;
        let hasNextPage = true;
        const date = format(subDays(now, day), 'yyyy-MM-dd');
        const randomDate = this.#getRandomTodayDate(date);
        while (hasNextPage) {
          const holders = await this.goldrushApiService.getTokenHolders(
            CONFIG.MAIN_TOKEN.ADDRESS,
            GoldrushChains.EthMainnet,
            { date, pageNumber },
          );
          if (!holders) {
            this.logger.error('Error');
            break;
          }
          await this.updateRewardsSnapshots(
            holders.items.map((item) => ({
              address: toLower(item.address),
              balance: Big(item.balance)
                .div(10 ** CONFIG.MAIN_TOKEN.DECIMALS)
                .toNumber(),
              balanceUsd: 0,
            })),
            randomDate,
            amountOfDays,
          );
          pageNumber++;
          hasNextPage = holders.pagination.has_more;
          await delay(1e3);
        }
        amountOfDays = days[days.length - i];
      }
      this.logger.verbose('Finished');
    } catch (error) {
      console.log(error);
      this.logger.error('Error on fillSnapshotsBeforeStartProject', {
        ...error,
      });
    }
  }

  async updateRewardsSnapshots(
    holders: Holder[],
    date: string,
    holdingDays: number,
  ) {
    try {
      this.logger.verbose(`Need to update ${holders.length} holders`);
      for (const holder of holders) {
        await this.updateHolderRewardsSnapshot(holder, date, holdingDays);
      }
      this.logger.verbose(`Finish to update ${holders.length} holders`);
    } catch (error) {
      console.log(error);
      this.logger.error('Error on updateRewardsSnapshots', { ...error });
    }
  }

  async updateHolderRewardsSnapshot(
    holder: Holder,
    date: string,
    holdingDays?: number,
  ): Promise<SnapshotUserInfoEntity | null> {
    const lastSnapshot = await this.#getUserLastSnapshotByWallet(
      toLower(holder.address),
    );
    if (!lastSnapshot) {
      const snapshot = await this.#updateCurrentSnapshotWithoutLastSnapshot(
        holder,
        date,
      );
      return snapshot;
    }

    const isExistsSnapshot =
      isAddressesEqual(lastSnapshot.walletAddress, holder.address) &&
      date === lastSnapshot.date;

    if (isExistsSnapshot) {
      return null;
    }
    // TODO change to diff days
    const diffInDays =
      holdingDays || differenceInDays(new Date(), lastSnapshot.date);

    const diffBalancesBN = Big(holder.balance);

    const lastDistributionRaw = lastSnapshot.holdingDistribution[lastSnapshot.holdingDistribution.length - 1];
    const lastDistribution = JSON.parse(lastDistributionRaw);

    if (diffBalancesBN.eq(lastDistribution.amount)) {
      const snapshot = await this.#updateSnapshotNoChangeBalance(
        holder,
        date,
        lastSnapshot,
        diffInDays,
      );
      return snapshot;
    }

    else if (diffBalancesBN.gt(lastDistribution.amount)) {
      const snapshot = await this.#updateSnapshotDepositBalance(
        holder,
        date,
        lastSnapshot,
        diffBalancesBN,
        diffInDays,
      );
      return snapshot;
    }

    else if (diffBalancesBN.lt(lastDistribution.amount)) {
      const snapshot = await this.#updateSnapshotClaimBalance(
        holder,
        date,
        lastSnapshot,
        diffBalancesBN.abs(),
        diffInDays,
      );
      return snapshot;
    }
    return null;
  }

  async #updateSnapshotClaimBalance(
    holder: Holder,
    date: string,
    prevSnapshot: SnapshotUserInfoEntity,
    diffBalancesBN: Big,
    holdingDays: number,
  ) {
    const newHoldingDistribution: string[] = [];
    const holdings = prevSnapshot.holdingDistribution
      .map((item) => JSON.parse(item))
      .sort((a, b) => a.holdingDays - b.holdingDays);

    for (const [i, holding] of holdings.entries()) {
      const diffBetweenCurrentHoldBN = diffBalancesBN.minus(holding.amount);

      if (diffBetweenCurrentHoldBN.gt(0)) {
        continue;
      }

      if (diffBetweenCurrentHoldBN.eq(0)) {
        const remainingHolding = holdings.slice(i).map((item) =>
          JSON.stringify({
            ...item,
            holdingDays: item.holdingDays + diffBalancesBN,
            coeff: getRewardCoeff(item.holdingDays + diffBalancesBN),
          }),
        );
        newHoldingDistribution.push(...remainingHolding);
        break;
      }

      if (diffBetweenCurrentHoldBN.lt(0)) {
        const remainingHolding = holdings.slice(i + 1).map((item) =>
          JSON.stringify({
            ...item,
            holdingDays: item.holdingDays + diffBalancesBN,
            coeff: getRewardCoeff(item.holdingDays + diffBalancesBN),
          }),
        );
        newHoldingDistribution.push(
          JSON.stringify({
            ...holding,
            amount: diffBetweenCurrentHoldBN.toString(),
            holdingDays: holding.holdingDays + diffBalancesBN,
            coeff: getRewardCoeff(holding.holdingDays + diffBalancesBN),
          }),
          ...remainingHolding,
        );
        break;
      }
    }

    const snapshot = await this.dataSource.manager.save(
      SnapshotUserInfoEntity,
      {
        walletAddress: toLower(holder.address),
        totalUsdBalance: holder.balanceUsd,
        date,
        holdingDistribution: newHoldingDistribution,
        checkInStages: [...prevSnapshot.checkInStages, getStageOfCheckIn()],
      },
    );

    return snapshot;
  }

  async #updateSnapshotDepositBalance(
    holder: Holder,
    date: string,
    prevSnapshot: SnapshotUserInfoEntity,
    diffBalancesBN: Big,
    holdingDays: number,
  ) {
    const snapshot = await this.dataSource.manager.save(
      SnapshotUserInfoEntity,
      {
        walletAddress: toLower(holder.address),
        totalUsdBalance: holder.balanceUsd,
        date,
        checkInStages: [...prevSnapshot.checkInStages, getStageOfCheckIn()],
        holdingDistribution: [
          ...prevSnapshot.holdingDistribution.map((item) => {
            const res = JSON.parse(item);
            return JSON.stringify({
              ...res,
              holdingDays: res.holdingDays + holdingDays,
              coeff: getRewardCoeff(res.holdingDays + holdingDays),
            });
          }),
          JSON.stringify({
            amount: diffBalancesBN.toString(),
            holdingDays: 1,
            coeff: getRewardCoeff(1),
          }),
        ],
      },
    );

    return snapshot;
  }

  async #updateSnapshotNoChangeBalance(
    holder: Holder,
    date: string,
    prevSnapshot: SnapshotUserInfoEntity,
    holdingDays: number,
  ) {
    const snapshot = await this.dataSource.manager.save(
      SnapshotUserInfoEntity,
      {
        walletAddress: toLower(holder.address),
        totalUsdBalance: holder.balanceUsd,
        date,
        checkInStages: [...prevSnapshot.checkInStages, getStageOfCheckIn()],
        holdingDistribution: prevSnapshot.holdingDistribution.map((item) => {
          const res = JSON.parse(item);
          return JSON.stringify({
            ...res,
            holdingDays: res.holdingDays + holdingDays,
            coeff: getRewardCoeff(res.holdingDays + holdingDays),
          });
        }),
      },
    );
    return snapshot;
  }

  async #updateCurrentSnapshotWithoutLastSnapshot(
    holder: Holder,
    date: string,
  ) {
    const snapshot = await this.dataSource.manager.save(
      SnapshotUserInfoEntity,
      {
        walletAddress: toLower(holder.address),
        totalUsdBalance: holder.balanceUsd,
        date,
        checkInStages: [getStageOfCheckIn()],
        holdingDistribution: [
          JSON.stringify({
            amount: holder.balance,
            holdingDays: 1,
            coeff: getRewardCoeff(1),
          }),
        ],
      },
    );
    return snapshot;
  }

  async #getUserLastSnapshotByWallet(walletAddress: string) {
    const snapshot = await this.dataSource.manager.findOne(
      SnapshotUserInfoEntity,
      {
        where: {
          walletAddress,
          date: MoreThanOrEqual(new Date(getLastProjectStartDate() * 1000).toISOString()),
        },
        order: { date: 'DESC' },
      },
    );
    return snapshot;
  }

  #getRandomTodayDate(date: string) {
    const today = startOfDay(date);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    const randomTime = addSeconds(
      addMinutes(addHours(today, randomHours), randomMinutes),
      randomSeconds,
    );
    return format(randomTime, 'yyyy-MM-dd HH:mm:ss');
  }

  async #sendTelegramMessage(
    user: UserEntity,
    snapshot: SnapshotUserInfoEntity,
    tokensList: TokensListResponse[],
  ) {
    const msg = [
      `<strong>${user.walletAddress}</strong>`,
      `Total balance: ${snapshot.totalUsdBalance}$`,
      `${snapshot.date}`,
      'Networks:',
    ];

    const groupByChain = _.groupBy(tokensList, (i) => i.chain);

    Object.keys(groupByChain).forEach((chainName) => {
      msg.push(`<strong>${chainName}:</strong>`);
      const balanceOnChain = groupByChain[chainName];
      balanceOnChain.forEach((balance) => {
        if (balance.amount * balance.price < MIN_BALANCE_USD) {
          return;
        }
        msg.push(
          `- ${balance.name} ${balance.amount} (${balance.amount * balance.price
          })`,
        );
      });
    });

    msg.push(`<strong>History:</strong>`);
    snapshot.holdingDistribution.forEach((holding) => {
      const parsed = JSON.parse(holding);
      msg.push(
        `Pepe: ${parsed.amount}, Holding: ${parsed.holdingDays}, Coeff: ${parsed.coeff}`,
      );
    });
    await this.botTelegramService.sendMessage(
      CONFIG.TELEGRAM.CHANNEL_ID,
      msg.join('\n'),
      'HTML',
    );
  }
}
