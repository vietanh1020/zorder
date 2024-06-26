import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class PriceOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

class OptionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @IsArray()
  @Type(() => PriceOptionDto)
  data: PriceOptionDto[];
}

export class FoodOrderDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  note: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @ValidateNested()
  @IsArray()
  @Type(() => OptionDto)
  options: OptionDto[];
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  tableId: string;

  @ValidateNested()
  @IsArray()
  @Type(() => FoodOrderDto)
  foods: FoodOrderDto[];

  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
