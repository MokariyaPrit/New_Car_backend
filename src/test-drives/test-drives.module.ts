// src/test-drive/test-drive.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDrive } from './entities/test-drive.entity';
import { Car } from '../cars/entities/car.entity';
import { TestDriveController } from './test-drives.controller';
import { TestDriveService } from './test-drives.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestDrive, Car])],
  controllers: [TestDriveController],
  providers: [TestDriveService],
})
export class TestDriveModule {}
