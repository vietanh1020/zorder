import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CardInfo {
  @IsString()
  @IsNotEmpty()
  cardName: string;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  stipeCardId: string;
}

export class CreateCardDto {
  @IsString()
  cardName: string;

  @IsBoolean()
  isDefault: boolean;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsString()
  method: string;
}
