import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../../database/database.service';
import { WalletService } from '../wallet/wallet.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService, 
    DatabaseService,
    WalletService
  ],
  exports: [UserService],
})
export class UserModule {}
