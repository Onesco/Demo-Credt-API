import { IsNotEmpty } from 'class-validator';

export class FundUserDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  txn_type: string;

  purpose: string;

  metadata: object;
}
