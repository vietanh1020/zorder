import { IsNotEmpty, IsString } from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  openAt: string;

  @IsString()
  @IsNotEmpty()
  closeAt: string;

  @IsString()
  @IsNotEmpty()
  openDay: string;
}
