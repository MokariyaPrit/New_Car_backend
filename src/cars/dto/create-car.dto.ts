// src/cars/dto/create-car.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string; // Cloudinary image URL
}
