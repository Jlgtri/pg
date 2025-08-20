import CONFIG from 'config';
import { DynamicModule } from '@nestjs/common';

import * as ControllerMap from './controllers';
import * as ServiceMap from './services';
import * as StrategyMap from './strategies';
import { DbConfig, TypeOrmModule } from '@libs/db';
import { SignatureService } from 'libs/utils/src';
import { TweetsClient } from 'apps/x-handler/src/clients';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheInterceptor, CacheModule } from '@libs/cache';
import { RewardsSnapshotsClient } from 'apps/rewards-handler/src/clients';

export class ApiModule {
  static forRoot(): DynamicModule {
    const Controllers = Object.values(ControllerMap);
    const Services = Object.values(ServiceMap);
    const Strategies = Object.values(StrategyMap);
    return {
      module: this,
      imports: [
        TypeOrmModule.forRoot({
          ...DbConfig.Postgres,
          synchronize: CONFIG.POSTGRES.SYNC,
        }),
        JwtModule.register({}),
        PassportModule.register({ defaultStrategy: 'jwt', session: true }),
        CacheModule.forRoot(),
      ],
      providers: [
        ...Services,
        ...Strategies,
        SignatureService,
        TweetsClient,
        CacheInterceptor,
        RewardsSnapshotsClient,
        {
          provide: CONFIG.SESSION_SECRET,
          useValue: CONFIG.SESSION_SECRET,
        },
      ],
      controllers: [...Controllers],
    };
  }
}
