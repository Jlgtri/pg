import { Injectable, Logger } from '@nestjs/common';

import { CacheTypes } from '../cache.constants';

import { RedisService } from '@liaoliaots/nestjs-redis';
import { getAllApiCacheKey, getApiCacheKeyByKey } from '../utils';

@Injectable()
export class CacheCommonService {
  constructor(private readonly redis: RedisService) {}

  private logger = new Logger(CacheCommonService.name);

  async clearAllCaches() {
    await Promise.all([
      this.#clearCache(CacheTypes.RewardsSnapshotsTimes),
      this.#clearCache(CacheTypes.RewardsSnapshotsInfo),
      this.#clearCache(CacheTypes.RewardsNextResult),
      this.#clearCache(CacheTypes.RewardsFinalResult),
      this.#clearCache(CacheTypes.RewardsSnapshotsList),
      this.#clearCache(CacheTypes.ProjectInfo),
    ]);
    this.logger.verbose('All caches cleared');
  }

  async #clearCache(cacheType: CacheTypes, key?: string) {
    try {
      const allKeys = await this.redis
        .getOrThrow()
        .keys(
          key
            ? getApiCacheKeyByKey(cacheType, key)
            : getAllApiCacheKey(cacheType),
        );
      if (!allKeys.length) return;
      await this.redis.getOrThrow().del(allKeys);
      this.logger.debug(`Cache ${cacheType} cleared`, {
        keysCount: allKeys.length,
      });
    } catch (error) {
      this.logger.warn(`Clearing cache  ${cacheType} failed`, { error });
    }
  }
}
