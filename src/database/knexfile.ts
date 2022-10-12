import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: process.env.DB_CLIENT_STAGING,
    connection: {
      host: process.env.DB_HOST_STAGING,
      port: parseInt(process.env.DB_PORT_STAGING),
      user: process.env.DB_USERNAME_STAGING,
      password: process.env.DB_PASSWORD_STAGING,
      database: process.env.DB_NAME_STAGING,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: process.env.DB_CLIENT_STAGING,
    connection: {
      host: process.env.DB_HOST_PROD,
      port: parseInt(process.env.DB_PORT_PROD),
      user: process.env.DB_USERNAME_PROD,
      password: process.env.DB_PASSWORD_PROD,
      database: process.env.DB_NAME_PROD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

module.exports = config;
