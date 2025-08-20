import { CacheModule as CacheModuleLib } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';

import { RedisModule } from '@liaoliaots/nestjs-redis';

import { RedisConfig } from './constants/config.constants';
import { CacheCommonService, CacheManager } from './services';

@Module({})
export class CacheModule {
  static forRoot(): DynamicModule {
    return {
      module: this,
      imports: [
        RedisModule.forRoot(RedisConfig),
        CacheModuleLib.registerAsync({
          useFactory: async () => {
            const redisConfig = RedisConfig.config;
            const conf = {
              store: redisStore({
                ...redisConfig,
              }),
            };
            return conf;
          },
        }),
      ],
      providers: [
        {
          provide: 'CACHE_MANAGER',
          useClass: CacheManager,
        },
        CacheCommonService,
      ],
      exports: ['CACHE_MANAGER', CacheCommonService],
    };
  }
}
