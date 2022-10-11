import { IsNotEmpty } from 'class-validator';

export class UpdateFundDto {
  @IsNotEmpty()
  amount: number;
}

export class TransferFundDto extends UpdateFundDto {
  @IsNotEmpty()
  to: number;
}
