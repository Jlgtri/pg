import { SnapshotUserInfoEntity, UserEntity } from '@libs/db';
import { Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

export class UsersRewardsSnapshotsService {
  @Inject() private dataSource: DataSource;

  private logger = new Logger();

  async onApplicationBootstrap() {
    // TODO uncoment after remove fillSnapshotsBeforeStartProject
    // await this.linkUserWithSnapshots();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async linkUserWithSnapshots(userId?: number) {
    try {
      await this.dataSource.manager.query(`
        UPDATE ${SnapshotUserInfoEntity.Name}
        SET "userId" = ${UserEntity.Name}.id
        FROM ${UserEntity.Name}
        WHERE ${SnapshotUserInfoEntity.Name}."walletAddress" = ${UserEntity.Name
        }."walletAddress"
        ${userId ? `AND ${UserEntity.Name}.id = ${userId}` : ''}
        AND ${SnapshotUserInfoEntity.Name}."userId" IS NULL;
      `);
      this.logger.verbose('Updated users snapshots');
    } catch (error) {
      console.log(error);
      this.logger.error('Error on linkUserWithSnapshots', { ...error });
    }
  }
}
