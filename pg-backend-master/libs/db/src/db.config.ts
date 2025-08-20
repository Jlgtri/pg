import CONFIG from 'config';
import * as EntityMap from './entities';
// import * as MigrationMap from '../../../migrations';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const Entities = [...Object.values(EntityMap)];
// const Migrations = Object.values(MigrationMap);

const { POSTGRES } = CONFIG;
export const Postgres: PostgresConnectionOptions = {
  type: 'postgres',
  host: POSTGRES.HOST,
  port: POSTGRES.PORT,
  database: POSTGRES.DB,
  username: POSTGRES.USER,
  password: POSTGRES.PASSWORD,
  synchronize: CONFIG.POSTGRES.SYNC,
  entities: Entities,
  // migrations: Migrations,
  migrationsRun: true,
  connectTimeoutMS: 30e3,
  logger: 'advanced-console',
  maxQueryExecutionTime: 5e3,
  // logging: true,
  ssl: POSTGRES.SSL,
};

export default Postgres;
