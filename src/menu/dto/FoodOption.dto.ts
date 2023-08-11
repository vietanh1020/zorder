import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class PriceDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateFoodOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @ValidateNested()
  @IsArray()
  @Type(() => PriceDto)
  data: PriceDto[];
}
