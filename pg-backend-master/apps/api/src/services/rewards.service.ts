import { TOKENS_ON_EACH_CHECK_IN } from '@libs/constants';
import { SnapshotUserInfoEntity } from '@libs/db';
import {
  getRewardCoeff,
  getStageOfCheckIn
} from '@libs/utils';
import {
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RewardsSnapshotsClient } from 'apps/rewards-handler/src/clients';
import Big from 'big.js';
import CONFIG from 'config';
import { differenceInDays, format } from 'date-fns';
import { DataSource } from 'typeorm';

export class RewardsService {
  @Inject() private dataSource: DataSource;
  @Inject() private rewardsSnapshotsClient: RewardsSnapshotsClient;

  async getSnapshotsTimes(wallet: string) {
    const query = this.dataSource.createQueryBuilder(
      SnapshotUserInfoEntity,
      'sui',
    );
    query.select('DISTINCT sui."date" as dates');
    query.innerJoin('sui.user', 'u');
    query.where('u."walletAddress" = :wallet', { wallet });
    query.orderBy('date', 'DESC');
    const res = await query.getRawMany();
    return res.map(({ dates }) => dates);
  }

  async getSnapshotInfo(wallet: string, date: Date) {
    const query = this.dataSource.createQueryBuilder(
      SnapshotUserInfoEntity,
      'sui',
    );
    query.innerJoinAndSelect('sui.user', 'u');
    query.where(`date_trunc(\'day\', date) = :dateByDay`, {
      dateByDay: format(date, 'yyyy-MM-dd'),
    });
    query.andWhere('u."walletAddress" = :wallet', { wallet });
    const snapshot = await query.getOne();
    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }
    return {
      date: snapshot.date,
      snapshotNumber: Math.max(...snapshot.checkInStages),
      pegeAmount:
        TOKENS_ON_EACH_CHECK_IN[Math.max(...snapshot.checkInStages)] ?? 0,
      holdingDistribution: snapshot.holdingDistribution.map((item) => {
        const parsed = JSON.parse(item);
        return {
          ...parsed,
          pepeAmount: parsed.amount,
        };
      }),
    };
  }

  async getSnapshotsList(wallet: string) {
    const query = this.dataSource.createQueryBuilder(
      SnapshotUserInfoEntity,
      'sui',
    );
    query.innerJoinAndSelect('sui.user', 'u');
    query.where('u."walletAddress" = :wallet', { wallet });
    const snapshots = await query.getMany();
    return snapshots.map((snapshot) => ({
      date: snapshot.date,
      snapshotNumber: Math.max(...snapshot.checkInStages),
      pegeAmount:
        TOKENS_ON_EACH_CHECK_IN[Math.max(...snapshot.checkInStages)] ?? 0,
      holdingDistribution: snapshot.holdingDistribution.map((item) => {
        const parsed = JSON.parse(item);
        return {
          ...parsed,
          pepeAmount: parsed.amount,
        };
      }),
    }));
  }

  async getFinalRewardsResult(wallet: string) {
    const lastSnapshot = await this.#getLastUserSnapshot(wallet);
    const diffDays = differenceInDays(CONFIG.PROJECT.END_DATE, new Date());
    return this.#getPotentialRewardsResult(
      lastSnapshot.holdingDistribution,
      diffDays,
      lastSnapshot.checkInStages,
    );
  }

  async getNextRewardsResult(wallet: string) {
    const lastSnapshot = await this.#getLastUserSnapshot(wallet);
    return this.#getPotentialRewardsResult(
      lastSnapshot.holdingDistribution,
      1,
      lastSnapshot.checkInStages,
    );
  }

  async canCheckIn(wallet: string) {
    const snapshot = await this.#getLastUserSnapshot(wallet);
    const stage = getStageOfCheckIn();
    return !snapshot || Math.max(...snapshot.checkInStages) !== stage;
  }

  async checkIn(wallet: string) {
    const res = await this.rewardsSnapshotsClient.checkIn(wallet);
    if (!res.success) {
      throw new UnprocessableEntityException(res?.text ?? '');
    }
    const snapshot = await this.#getLastUserSnapshot(wallet);
    return snapshot.holdingDistribution.map((holding) => {
      const holdingParsed = JSON.parse(holding);
      const coeff = getRewardCoeff(holdingParsed.holdingDays);
      const finalRewards = Big(holdingParsed.amount).times(coeff);
      return {
        ...holdingParsed,
        pepeAmount: finalRewards.toNumber(),
        coeff,
        snapshotNumber: Math.max(...snapshot.checkInStages),
        pegeAmount: TOKENS_ON_EACH_CHECK_IN[Math.max(...snapshot.checkInStages)] ?? 0,
      };
    });
  }

  #getPotentialRewardsResult(
    holdingDistribution: string[],
    daysToAdd: number,
    stages: number[],
  ) {
    const res = holdingDistribution.map((holding) => {
      const holdingParsed = JSON.parse(holding);
      const sumDays = holdingParsed.holdingDays + daysToAdd;
      const coeff = getRewardCoeff(sumDays);
      const finalRewards = Big(holdingParsed.amount).times(coeff);
      return {
        ...holdingParsed,
        pepeAmount: finalRewards.toNumber(),
        coeff,
        snapshotNumber: Math.max(...stages),
        pegeAmount: stages.reduce(
          (acc, curr) => acc + (TOKENS_ON_EACH_CHECK_IN[curr] ?? 0),
          0,
        ),
      };
    });
    return res;
  }

  async #getLastUserSnapshot(wallet: string) {
    const query = this.dataSource.manager.createQueryBuilder(
      SnapshotUserInfoEntity,
      'sui',
    );
    query.innerJoinAndSelect('sui.user', 'u');
    query.where('u."walletAddress" = :wallet', { wallet });
    query.orderBy('date', 'DESC');
    const snapshot = await query.getOne();
    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }
    return snapshot;
  }
}
