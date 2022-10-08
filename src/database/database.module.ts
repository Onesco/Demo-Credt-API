/* eslint-disable prettier/prettier */
import { KnexModule } from 'nestjs-knex';
import * as dotenv from 'dotenv';
import { DynamicModule, Module } from '@nestjs/common';
dotenv.config();

import { DatasourceConfig } from '../config/env.config';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  static forRoot({
    config,
  }: {
    config: { datasource: DatasourceConfig };
  }): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        KnexModule.forRootAsync({
          useFactory: () => ({
            config: {
              client: config.datasource.client,
              connection: {
                host: config.datasource.host,
                port: config.datasource.port,
                user: config.datasource.username,
                password: config.datasource.password,
                database: config.datasource.database,
              },
              migrations: {
                tableName: 'knex_migrations',
                directory:'./migrations',
                extension: 'ts'
              }
            },
          }),
        }),
      ],
      providers: [DatabaseService],
      exports: [DatabaseService],
    };
  }
}
