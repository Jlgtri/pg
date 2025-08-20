import { Injectable, Logger } from '@nestjs/common';

import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheManager {
  constructor(private readonly redis: RedisService) { }

  logger = new Logger(CacheManager.name);

  set<T>(key: string, value: T, { ttl }: { ttl: number }) {
    return this.redis.getOrThrow().setex(key, ttl, JSON.stringify(value));
  }

  get(key: string) {
    return this.redis.getOrThrow().get(key);
  }

  del?(key: string) {
    return this.redis.getOrThrow().del(key);
  }
}
