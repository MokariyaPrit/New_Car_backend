import { IsOptional } from "class-validator";

export class UpdateCarDto {
  @IsOptional() brand?: string;
  @IsOptional() model?: string;
  @IsOptional() year?: number;
  @IsOptional() color?: string;
  @IsOptional() number?: string;
  @IsOptional() type?: string;
  @IsOptional() transmission?: string;
  @IsOptional() fuelType?: string;
  @IsOptional() mileage?: number;
  @IsOptional() price?: number;
  @IsOptional() imageUrl?: string;
}
