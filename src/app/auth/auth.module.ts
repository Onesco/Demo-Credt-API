import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from '../../config/env.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1 hr' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
