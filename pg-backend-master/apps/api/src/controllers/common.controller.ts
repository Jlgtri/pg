import { CACHE_TTL, CacheTypes } from '@libs/cache';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import CONFIG from 'config';
import { WalletDTO } from '../dto/common.dto';
import { XService } from '../services';

@Controller('common')
@ApiTags('common')
export class CommonController {
  @Inject() private xServise: XService;

  @CacheKey(CacheTypes.ProjectInfo)
  @CacheTTL(CACHE_TTL[CacheTypes.ProjectInfo])
  @Get('project-info')
  async getSnapshotsTimes() {
    return {
      start: CONFIG.PROJECT.START_DATE,
      end: CONFIG.PROJECT.END_DATE,
    };
  }

  @Get('has-tweet')
  async hasTweet(@Query() { wallet }: WalletDTO) {
    return this.xServise.hasTweet(wallet);
  }
}
