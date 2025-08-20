import { DbConfig } from '@libs/db';
import { DataSource } from 'typeorm';

export default new DataSource(DbConfig.Postgres);
