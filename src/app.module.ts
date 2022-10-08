/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { datasource } from './config/env.config';

import { UserModule } from './app/user/user.module'
import { WalletModule } from './app/wallet/wallet.module'
import {TransferModule} from './app/transfer/transfer.module'

@Module({
  imports: [
    DatabaseModule.forRoot({config:{datasource}}),
    UserModule,
    WalletModule,
    TransferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
