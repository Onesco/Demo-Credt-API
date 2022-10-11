import * as dotenv from 'dotenv';
dotenv.config();

type IEnv = {
  NODE_ENV: string;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  DB_NAME: string;
  PORT: string;
  DB_PORT: string;
  DB_HOST: string;
  TOKEN_SECRET: string;
  SHA_512_HASH: string;
  JWT_SECRET: string;
  DB_HOST_TEST: string;
  DB_PORT_TEST: string;
  DB_USERNAME_TEST: string;
  DB_PASSWORD_TEST: string;
  DB_NAME_TEST: string;
  DB_CLIENT: string;
};

const env: IEnv = process.env as IEnv;
type EnvType = 'development' | 'test' | 'staging' | 'production' | 'pipeline';

export const appEnv: EnvType = (env.NODE_ENV as EnvType) || 'development';
export const envIsDev = appEnv === 'development';
export const JWT_TOKEN_SECRET: string = env.TOKEN_SECRET;
export const PORT: string | number = env.PORT || 4000;
export const DB_PORT = parseInt(env.DB_PORT);
export const DB_USERNAME = env.DB_USERNAME;
export const DB_PASSWORD = env.DB_PASSWORD;
export const DB_NAME = env.DB_NAME;
export const DB_HOST = env.DB_HOST;
export const DEFAULT_PAGE_LIMIT = 50;
export const datasource =
  appEnv === 'pipeline' || appEnv === 'test'
    ? {
        host: env.DB_HOST_TEST,
        port: parseInt(env.DB_PORT_TEST),
        username: env.DB_USERNAME_TEST,
        password: env.DB_PASSWORD_TEST,
        database: env.DB_NAME_TEST,
        client: env.DB_CLIENT,
      }
    : {
        host: DB_HOST,
        port: DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        client: env.DB_CLIENT,
      };

export const SHA_512_HASH = env.SHA_512_HASH;
export type DatasourceConfig = typeof datasource;
export const jwtConstants = { secret: env.JWT_SECRET };
