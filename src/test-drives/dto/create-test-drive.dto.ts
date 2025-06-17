// src/test-drives/dto/create-test-drive.dto.ts
import { IsUUID, IsDateString } from 'class-validator';

export class CreateTestDriveDto {
  @IsUUID()
  carId: string;

  @IsDateString()
  date: string;
}
