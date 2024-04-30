import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

  @IsBoolean()
  @IsNotEmpty()
  isMultiple: boolean;

  @ValidateNested()
  @IsArray()
  @Type(() => PriceDto)
  data: PriceDto[];
}
