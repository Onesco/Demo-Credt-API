import {
  Injectable,
  Logger,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';

import { DatabaseService } from '../../database/database.service';
import { IwalletFilter, IUser } from '../types/type.user';

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService) {}

  knex = this.databaseService.getDbHandler();
  private readonly logger = new Logger(WalletService.name);

  async findAll(user: IUser) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: ` you don't have right to this content`,
      });
    }
    return await this.knex('wallets');
  }

  async findOne(filter: IwalletFilter) {
    return await this.knex('wallets').where(filter).first();
  }
}
