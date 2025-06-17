// src/test-drive/dto/create-test-drive.dto.ts
import { IsUUID } from 'class-validator';

export class CreateTestDriveDto {
  @IsUUID()
  carId: string;
}
