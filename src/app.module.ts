/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { datasource } from './config/env.config';

import { UserModule } from './app/user/user.module';
import { WalletModule } from './app/wallet/wallet.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    DatabaseModule.forRoot({config:{datasource}}),
    AuthModule,
    UserModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
