// src/test-drive/test-drive.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDrive } from './entities/test-drive.entity';
import { Car } from '../cars/entities/car.entity';
import { TestDrivesController } from './test-drives.controller';
import { TestDrivesService } from './test-drives.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestDrive, Car])],
  controllers: [TestDrivesController],
  providers: [TestDrivesService],
})
export class TestDriveModule {}
