import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateFoodOptionDto } from './FoodOption.dto';

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  description: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CreateFoodOptionDto)
  foodOption: CreateFoodOptionDto[];
}
