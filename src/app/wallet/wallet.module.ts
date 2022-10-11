import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { DatabaseService } from '../../database/database.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, DatabaseService],
  exports: [WalletService],
})
export class WalletModule {}
