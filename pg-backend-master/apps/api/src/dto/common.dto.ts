import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsDate,
  IsEthereumAddress,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toLower } from 'libs/utils/src';

export class SignatureDTO {
  @ApiProperty()
  @Allow()
  @IsString()
  signature: string;
}

export class WalletDTO {
  @ApiProperty()
  @Allow()
  @IsEthereumAddress()
  @Transform(({ value }) => (value ? toLower(value) : undefined))
  wallet: string;
}

export class DataSignatureDTO extends WalletDTO {
  @ApiProperty()
  @IsNumber()
  timestamp: number;
}

export class SignatureBodyDTO extends SignatureDTO {
  @ApiProperty()
  @Allow()
  data: DataSignatureDTO;

  @ApiProperty()
  @Allow()
  @IsString()
  @Transform(({ value }) => (value ? toLower(value) : undefined))
  xUserName: string;
}

export class WalletBodyDTO {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  @Transform(({ value }) => (value ? toLower(value) : undefined))
  wallet: string;
}

export class DateQueryDTO {
  @ApiProperty()
  @IsDate({ message: 'Invalid date' })
  @Type(() => Date)
  date: Date;
}
