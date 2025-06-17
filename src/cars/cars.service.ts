// src/cars/cars.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

async create(createCarDto: CreateCarDto, manager: User) {
  const car = this.carRepository.create({ ...createCarDto, manager });
  return this.carRepository.save(car);
}

  async findAllByManager(managerId: string) {
    return this.carRepository.find({
      where: { manager: { id: managerId } },
      relations: ['manager'],
    });
  }
}
