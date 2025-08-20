import { DynamicModule } from '@nestjs/common';
import {
  TypeOrmModule as OriginalTypeormModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as DbConf from './db.config';

export class TypeOrmModule extends OriginalTypeormModule {
  static forRoot(
    options?: TypeOrmModuleOptions & { synchronize: boolean },
  ): DynamicModule {
    const opts: TypeOrmModuleOptions = options ?? DbConf.Postgres;
    return OriginalTypeormModule.forRoot(opts);
  }
}
