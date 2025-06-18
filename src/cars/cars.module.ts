// src/cars/cars.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car } from './entities/car.entity';
import { UsersModule } from 'src/users/users.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), UsersModule, CloudinaryModule],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
