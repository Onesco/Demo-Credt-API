import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto, LoginUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const accessToken = this.authService.login(req.user);
    return accessToken;
  }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
