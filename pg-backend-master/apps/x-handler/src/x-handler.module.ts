import { DynamicModule } from '@nestjs/common';

import * as ControllersMap from './controllers';
import * as ServicesMap from './services';
import { ApiService as TwitterApiIoApiService } from '@libs/twitterapi-io/services';
import { TypeOrmModule } from '@libs/db';

export class XHandlerModule {
  static forRoot(): DynamicModule {
    const Controllers = Object.values(ControllersMap);
    const Services = Object.values(ServicesMap);
    return {
      module: this,
      imports: [TypeOrmModule.forRoot()],
      controllers: [...Controllers],
      providers: [...Services, TwitterApiIoApiService],
    };
  }
}
