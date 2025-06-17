// src/test-drive/test-drive.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestDrive } from './entities/test-drive.entity';
import { Repository } from 'typeorm';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { Car } from '../cars/entities/car.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TestDriveService {
  constructor(
    @InjectRepository(TestDrive)
    private tdRepo: Repository<TestDrive>,
    @InjectRepository(Car)
    private carRepo: Repository<Car>,
  ) {}

  async request(dto: CreateTestDriveDto, user: User) {
  const car = await this.carRepo.findOneBy({ id: dto.carId });

  if (!car) {
    throw new Error('Car not found');
  }

  const testDrive = this.tdRepo.create({
    car,
    user,
  });

  return this.tdRepo.save(testDrive);
}


  async listForManager(managerId: string) {
    return this.tdRepo.find({
      relations: ['car', 'user'],
      where: {
        car: { manager: { id: managerId } },
      },
    });
  }

  async updateStatus(id: string, status: 'accepted' | 'rejected') {
    await this.tdRepo.update(id, { status });
    return { message: `Test drive ${status}` };
  }
}
