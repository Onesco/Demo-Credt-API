import {
  IsEmail,
  IsNotEmpty,
  Length,
  MinLength,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({ type: 'email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minimum: 8, required: true })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({ maxLength: 30, minLength: 2, required: true })
  @Length(2, 30)
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ maxLength: 30, minLength: 2, required: true })
  @Length(2, 30)
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ enum: ['ADMIN', 'USER', 'SUPERUSER'] })
  @IsOptional()
  role: string;
}

export class LoginUserDto extends BaseUserDto {
  pass;
}
