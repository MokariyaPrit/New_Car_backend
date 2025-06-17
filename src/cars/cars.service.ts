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
    private carRepo: Repository<Car>,
  ) {}

  async create(dto: CreateCarDto, manager: User) {
    const car = this.carRepo.create({ ...dto, manager });
    return this.carRepo.save(car);
  }

  async findAllByManager(managerId: string) {
    return this.carRepo.find({
      where: { manager: { id: managerId } },
      relations: ['manager'],
    });
  }
}
