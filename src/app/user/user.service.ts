/* eslint-disable prettier/prettier */
import { 
  Injectable, 
  HttpCode, 
  HttpStatus, 
  HttpException,
  ForbiddenException, 
  Logger
} from '@nestjs/common';
import { randomUUID } from 'crypto'

const uuid = randomUUID()

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {FundUserDto} from './dto/fund-user.dto';
import { DatabaseService } from '../../database/database.service';
import { hashUtils } from "../../utils/utils.lib";
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {

  constructor(
    private databaseService: DatabaseService,
    private walletService: WalletService
    ){};
  knex = this.databaseService.getDbHandler();
  private readonly logger = new Logger(UserService.name)

  @HttpCode(201)
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Registering user`);
    const {first_name, last_name, email, password} = createUserDto
  
      const user = await this.knex('users').where({email}).first();
      if(user && user.id){
      throw new ForbiddenException(
          {
            status: HttpStatus.FORBIDDEN,
            error: `user already exist with this ${email}` 
          }
        );
      };
      const hashedPassword = hashUtils.hash(password);
      const user_name = `${first_name} ${last_name}`.toLocaleUpperCase()
      const user_id = await this.knex.table('users').insert({ user_name, email, password: hashedPassword});
      
      // creating user wallet upon registration
      await this.knex('wallets').insert({user_id, balance:0.0})

    return `user ${email} created with id:  ${user_id}`;
  }

  async findAll() {
    const users = await this.knex('users');
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.knex('users').where({email}).first();
    return user;
  }

  async findOneById(id: number) {
    const user = await this.knex('users').where({id}).first();
    return user;
  }

  async fund(fundUserDto: FundUserDto, user_id: number){
    const {amount, txn_type, purpose} = fundUserDto
    const wallet  = await this.walletService.findOne({user_id});

    // create transaction
    // Using trx as a query builder
    let trx_id
    this.knex.transaction(trx => {
      return trx
        .insert({wallet_id: wallet.id, amount, txn_type, reference:uuid, purpose})
        .into('transactions')
        .then( transaction_id => {
          trx_id = transaction_id;
          return trx('wallets').where({id:wallet.id, user_id}).increment('balance', amount).update({updated_at: new Date()});
        })
      })
      .then(wallet_id => {
        console.log(`${wallet_id} id funded`)
    })
    .catch(function(error) {
      console.error(error);
      return new HttpException(`transfer of fun aborted due to: ${error}`, 500)
    });
    return {
      message: "account funded successfully!",
      trx_id,
      amount
    }
  }
  
}
