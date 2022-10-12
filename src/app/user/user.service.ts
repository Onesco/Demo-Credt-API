import {
  Injectable,
  HttpCode,
  HttpStatus,
  HttpException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
const uuid = randomUUID();

import { CreateUserDto } from './dto/create-user.dto';
import { FundUserDto } from './dto/fund-user.dto';
import { DatabaseService } from '../../database/database.service';
import { hashUtils } from '../../utils/utils.lib';
import { WalletService } from '../wallet/wallet.service';
import { IUser } from '../types/type.user';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private walletService: WalletService,
  ) {}

  knex = this.databaseService.getDbHandler();
  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Registering user`);
    const { first_name, last_name, email, password, role } = createUserDto;

    const userRole = role ? role : 'USER';

    const user = await this.knex('users').where({ email }).first();
    if (user && user.id) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: `user already exist with this ${email}`,
      });
    }
    const hashedPassword = hashUtils.hash(password);
    const user_name = `${first_name} ${last_name}`.toLocaleUpperCase();
    const user_id = await this.knex.table('users').insert({
      user_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
    });

    // creating user wallet upon registration
    await this.knex('wallets').insert({ user_id, balance: 0.0 });

    return `user ${email} created with id:  ${user_id}`;
  }

  async findAll(user: IUser) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: ` you don't have right to this content`,
      });
    }
    const users = await this.knex('users');
    return users;
  }

  async findMe(user: IUser) {
    return await this.findOneByEmail(user.email);
  }

  async findOneByEmail(email: string) {
    const user = await this.knex('users').where({ email }).first();
    return user;
  }

  async findOneById(id: number) {
    const user = await this.knex('users').where({ id }).first();
    return user;
  }

  async findOne(id: number, user: IUser) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: ` you don't have right to this content`,
      });
    }
    return await this.findOneById(id);
  }

  async fund(fundUserDto: FundUserDto, user_id: number) {
    const { amount } = fundUserDto;

    //  check if amount is less than 0
    if (amount < 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: ` cant fund account with such negative ${amount} amount`,
      });
    }

    const wallet = await this.walletService.findOne({ user_id });
    // create transaction
    // Using trx as a query builder
    let trx_id;
    this.knex
      .transaction((trx) => {
        return trx
          .insert({
            wallet_id: wallet.id,
            amount,
            txn_type: 'CREDIT',
            reference: uuid,
          })
          .into('transactions')
          .then((transaction_id) => {
            trx_id = transaction_id;
            return trx('wallets')
              .where({ id: wallet.id, user_id })
              .increment('balance', amount)
              .update({ updated_at: new Date() });
          });
      })
      .then((wallet_id) => {
        this.logger.log(` id ${wallet_id} was funded`);
      })
      .catch(function (error) {
        this.logger.error(error);
        return new HttpException(
          `transfer of fun aborted due to: ${error}`,
          500,
        );
      });
    return {
      message: 'account funded successfully!',
      trx_id,
      amount,
    };
  }

  async withdrawFund(amount: number, user_id: number) {
    //  check if amount is less than 0
    if (amount < 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: ` cant withdraw such ${amount} amount`,
      });
    }

    const wallet = await this.walletService.findOne({ user_id });

    //  check if the user has up the required balance in his account
    if (wallet && wallet.balance < amount) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `${wallet.balance} is too low for this ${amount} of transaction`,
      });
    }
    // grand access to create a transaction
    // create transaction
    let trx_id;
    this.knex
      .transaction((trx) => {
        return trx
          .insert({
            wallet_id: wallet.id,
            amount,
            txn_type: 'DEBIT',
            reference: uuid,
          })
          .into('transactions')
          .then((transaction_id) => {
            trx_id = transaction_id;
            return trx('wallets')
              .where({ id: wallet.id, user_id })
              .decrement('balance', amount)
              .update({ updated_at: new Date() });
          });
      })
      .then((wallet_id) => {
        this.logger.log(`${amount} withdraw from this ${wallet_id}`);
      })
      .catch(function (error) {
        this.logger.log(error);
        return new HttpException(
          `withdrawal of fund aborted due to: ${error}`,
          500,
        );
      });
    return {
      message: 'withdrawal successfully!',
      trx_id,
      amount,
    };
  }

  async transferFund(amount: number, from: number, to: number): Promise<any> {
    //  check if amount is less than 0
    if (amount < 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: ` cant withdraw such ${amount} amount`,
      });
    }

    const senderWallet = await this.walletService.findOne({ user_id: from });

    const balance_before = senderWallet.balance;

    //  check if the sender user has up the required balance in his/her wallet
    if (senderWallet && senderWallet.balance < amount) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `${senderWallet.balance} is too low for this ${amount} of transaction`,
      });
    }

    // check for receiver's wallet detail
    const receiverWallet = await this.walletService.findOne({ user_id: to });
    if (!receiverWallet) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `receiver wallet id: ${to} does not exit`,
      });
    }
    // check if sender and receiever wallets are thesame
    if (receiverWallet.id === senderWallet.id) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: `you can't transfer fund from your wallet id: ${from} to your wallet id: ${to}`,
      });
    }

    // create a transaction
    let trx_id;
    this.knex
      .transaction((trx) => {
        return trx
          .insert({
            wallet_id: senderWallet.id,
            amount,
            txn_type: 'TRANSFER',
            reference: uuid,
          })
          .into('transactions')
          .then((transaction_id) => {
            trx_id = transaction_id;
            this.logger.log(`transaction created ${transaction_id}`);
            return trx('wallets')
              .where({ id: senderWallet.id, user_id: from })
              .decrement('balance', amount)
              .update({ updated_at: new Date() });
          })
          .then((sender_id) => {
            this.logger.log(`sending done ${sender_id}`);
            return trx('wallets')
              .where({ id: receiverWallet.id, user_id: to })
              .increment('balance', amount)
              .update({ updated_at: new Date() });
          })
          .then(async (receiver_id) => {
            this.logger.log(`receiver with id ${receiver_id} received`);
            const updatedSender = await trx('wallets')
              .where({ id: senderWallet.id, user_id: from })
              .first();
            const balance_after = updatedSender.balance;
            return trx('transfers').insert({
              transaction_id: trx_id,
              from,
              to,
              balance_before,
              balance_after: balance_after,
            });
          });
      })
      .then((transfer_id) => {
        this.logger.log(
          `this ${amount} has being transferred from you id:${from}, to ${to} with transfer id: ${transfer_id}`,
        );
      })
      .catch(function (error) {
        this.logger.log(error);
        return new HttpException(
          `transfer of fund aborted due to: ${error}`,
          500,
        );
      });

    return {
      message: 'transfer successfully!',
      trx_id,
      amount,
      from,
      to,
    };
  }

  async checkBalance(user_id: number) {
    const wallet = await this.walletService.findOne({ user_id });
    return {
      accountBalance: wallet.balance,
    };
  }

  async getTransactions(user_id: number) {
    const wallet = await this.walletService.findOne({ user_id });
    return await this.knex('transactions').where({ wallet_id: wallet.id });
  }

  async getTransactionsByType(user_id, txn_type: string) {
    const wallet = await this.walletService.findOne({ user_id });
    return await this.knex('transactions').where({
      txn_type,
      wallet_id: wallet.id,
    });
  }
}
