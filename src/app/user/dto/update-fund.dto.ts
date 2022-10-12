import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFundDto {
  @ApiProperty({ type: 'integer', required: true })
  @IsNotEmpty()
  amount: number;
}

export class TransferFundDto extends UpdateFundDto {
  @ApiProperty({ type: 'integer', required: true })
  @IsNotEmpty()
  to: number;
}
