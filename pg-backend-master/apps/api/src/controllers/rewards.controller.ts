import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RewardsService } from '../services';
import { DateQueryDTO, WalletBodyDTO, WalletDTO } from '../dto/common.dto';
import { XOauthUserProfile } from '../types/x-oauth.types';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_TTL, CacheInterceptor, CacheTypes } from '@libs/cache';

@Controller('rewards')
@ApiTags('rewards')
@UseInterceptors(CacheInterceptor)
export class RewardsController {
  @Inject() private rewardsService: RewardsService;

  @CacheKey(CacheTypes.RewardsSnapshotsTimes)
  @CacheTTL(CACHE_TTL[CacheTypes.RewardsSnapshotsTimes])
  @Get('snapshots/times')
  async getSnapshotsTimes(@Query() { wallet }: WalletDTO) {
    return this.rewardsService.getSnapshotsTimes(wallet);
  }

  @CacheKey(CacheTypes.RewardsSnapshotsInfo)
  @CacheTTL(CACHE_TTL[CacheTypes.RewardsSnapshotsInfo])
  @Get('snapshots/info')
  async getSnapshotInfo(
    @Query() { date }: DateQueryDTO,
    @Query() { wallet }: WalletDTO,
  ) {
    return this.rewardsService.getSnapshotInfo(wallet, date);
  }

  @CacheKey(CacheTypes.RewardsSnapshotsList)
  @CacheTTL(CACHE_TTL[CacheTypes.RewardsSnapshotsList])
  @Get('snapshots/list')
  async getSnapshotsList(@Query() { wallet }: WalletDTO) {
    return this.rewardsService.getSnapshotsList(wallet);
  }

  @CacheKey(CacheTypes.RewardsFinalResult)
  @CacheTTL(CACHE_TTL[CacheTypes.RewardsFinalResult])
  @Get('final-result')
  async getFinalRewardsResult(@Query() { wallet }: WalletDTO) {
    return this.rewardsService.getFinalRewardsResult(wallet);
  }

  @CacheKey(CacheTypes.RewardsNextResult)
  @CacheTTL(CACHE_TTL[CacheTypes.RewardsNextResult])
  @Get('next-result')
  async getNextRewardsResult(@Query() { wallet }: WalletDTO) {
    return this.rewardsService.getNextRewardsResult(wallet);
  }

  @Get('can-check-in')
  async canCheckIn(@Query() { wallet }: WalletDTO) {
    return this.rewardsService.canCheckIn(wallet);
  }

  @Post('check-in')
  async checkIn(@Body() { wallet }: WalletBodyDTO) {
    return this.rewardsService.checkIn(wallet);
  }
}
