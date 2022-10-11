import { Injectable, UnauthorizedException, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { hashUtils } from '../../utils/utils.lib';
import { CreateUserDto } from '../user/dto/create-user.dto';

type JwtPayload = {
  username: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`incorrect user credentials`);
    }
    if (user && user.password === hashUtils.hash(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload: JwtPayload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  @HttpCode(201)
  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
