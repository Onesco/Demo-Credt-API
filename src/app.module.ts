/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { datasource } from './config/env.config';

@Module({
  imports: [DatabaseModule.forRoot({config:{datasource}})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
