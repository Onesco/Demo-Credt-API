/* eslint-disable prettier/prettier */
import { InjectKnex, Knex } from 'nestjs-knex';

export class DatabaseService {
  constructor(@InjectKnex() public readonly knex: Knex) {};
  getDbHandler(): Knex {
    return this.knex;
  }
}
