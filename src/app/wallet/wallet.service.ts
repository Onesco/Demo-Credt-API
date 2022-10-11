import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../../database/database.service';

type IwalletFilter = {
  id?: number;
  user_id?: number;
}

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService){}

  knex = this.databaseService.getDbHandler();
  private readonly logger = new Logger(WalletService.name);
  
  async findAll() {
    return await this.knex('wallets');
  }

  async findOne(filter: IwalletFilter) {
    return await this.knex('wallets').where(filter).first();
  }
}
