import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  create(dto: CreateCarDto) {
    const car = this.carRepository.create(dto);
    return this.carRepository.save(car);
  }

  findAll() {
    return this.carRepository.find();
  }

  async update(id: string, dto: UpdateCarDto) {
    const car = await this.carRepository.findOne({ where: { id } });
    if (!car) throw new NotFoundException('Car not found');
    Object.assign(car, dto);
    return this.carRepository.save(car);
  }

  async remove(id: string) {
    const car = await this.carRepository.findOne({ where: { id } });
    if (!car) throw new NotFoundException('Car not found');
    return this.carRepository.remove(car);
  }


}
