import { UserEntity } from '@libs/db';
import {
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TweetsClient } from 'apps/x-handler/src/clients';
import { DataSource } from 'typeorm';

export class XService {
  @Inject() private dataSource: DataSource;
  @Inject() private tweetsClient: TweetsClient;

  async checkParticipation(wallet: string) {
    const user = await this.#getUserByWalletOrThrow(wallet);
    if (user.existsXTweet) return;
    const res = await this.tweetsClient.findTweetAndMarkAsExisting(wallet);
    if (!res.success) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!res.data) {
      throw new UnprocessableEntityException('Tweet not found');
    }
  }

  async hasTweet(wallet: string) {
    const user = await this.#getUserByWalletOrThrow(wallet);
    return {
      hasTweet: user.existsXTweet,
      xUserName: user.xUserName,
    };
  }

  async #getUserByWalletOrThrow(wallet: string) {
    const user = await this.dataSource.manager.findOneBy(UserEntity, {
      walletAddress: wallet,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
