import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFoodOptionDto } from './FoodOption.dto';

export class FoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  description: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CreateFoodOptionDto)
  foodOption: CreateFoodOptionDto[];
}
