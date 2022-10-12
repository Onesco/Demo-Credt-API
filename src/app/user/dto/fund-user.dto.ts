import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FundUserDto {
  @ApiProperty({ type: 'integer', required: true })
  @IsNotEmpty()
  amount: number;

  purpose: string;

  metadata: object;
}
