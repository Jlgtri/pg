import { DynamicModule, Provider } from '@nestjs/common';
import CONFIG from 'config';

import * as ServicesMap from './services';
import * as ControllersMap from './controllers';
import { TypeOrmModule } from '@libs/db';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiService as GoldrushApiService } from '@libs/goldrush/services';
import { CacheModule } from '@libs/cache';
import { DebankApiService } from '@libs/debank';
import { BotTelegramService, PROVIDE_BOT } from '@libs/telegram';

export class RewardsHandlerModule {
  static forRoot(): DynamicModule {
    const Services = Object.values(ServicesMap);
    const Controllers = Object.values(ControllersMap);
    return {
      module: this,
      imports: [
        TypeOrmModule.forRoot(),
        ScheduleModule.forRoot(),
        CacheModule.forRoot(),
      ],
      providers: [
        ...Services,
        GoldrushApiService,
        DebankApiService,
        this.#botService(),
      ],
      controllers: [...Controllers],
    };
  }

  static #botService(): Provider {
    return {
      provide: PROVIDE_BOT,
      useFactory: () => {
        const bot = new BotTelegramService();
        bot.initBot(CONFIG.TELEGRAM?.BOT?.TOKEN ?? '');
        return bot;
      },
    };
  }
}
