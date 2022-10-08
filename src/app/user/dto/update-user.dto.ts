import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumberString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumberString()
  id: number;
}
