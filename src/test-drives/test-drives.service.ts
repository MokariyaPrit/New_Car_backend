// src/test-drive/test-drive.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestDrive, TestDriveStatus } from './entities/test-drive.entity';
import { Repository } from 'typeorm';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { Car } from '../cars/entities/car.entity';
import { User } from '../users/entities/user.entity';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class TestDriveService {
  constructor(
    @InjectRepository(TestDrive)
    private testDriveRepo: Repository<TestDrive>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async request(dto: CreateTestDriveDto, user: User) {
  const car = await this.carRepository.findOneBy({ id: dto.carId });

  if (!car) {
    throw new Error('Car not found');
  }

  const testDrive = this.testDriveRepo.create({
    car,
    user,
  });

  return this.testDriveRepo.save(testDrive);
}


  async listForManager(managerId: string) {
    return this.testDriveRepo.find({
      relations: ['car', 'user'],
      where: {
        car: { manager: { id: managerId } },
      },
    });
  }

  // src/test-drives/test-drives.service.ts

async create(createTestDriveDto: CreateTestDriveDto, user: User) {
  const car = await this.carRepository.findOne({
    where: { id: createTestDriveDto.carId },
  });

  if (!car) throw new NotFoundException('Car not found');

  const newTestDrive = this.testDriveRepo.create({
    date: new Date(createTestDriveDto.date),
    user,
    car,
    status: TestDriveStatus.Pending,
  });

  return await this.testDriveRepo.save(newTestDrive);
}

 
async requestDrive(createDto: CreateTestDriveDto, user: User) {
  const car = await this.carRepository.findOne({ where: { id: createDto.carId } });
  if (!car) throw new NotFoundException('Car not found');

  const drive = this.testDriveRepo.create({
    car,
    user,
    status: TestDriveStatus.Pending,
  });

  return this.testDriveRepo.save(drive);
}

async updateStatus(id: string, status: TestDriveStatus) {
  const testDrive = await this.testDriveRepo.findOne({ where: { id: String(id) } });
  if (!testDrive) throw new NotFoundException('Test Drive not found');

  testDrive.status = status;
  return await this.testDriveRepo.save(testDrive);
}

findAll() {
  return this.testDriveRepo.find();
}

async getAll(status?: TestDriveStatus, user?: User) {
  const where: any = {};

  // Managers/Admins can see all; Users only their test drives
  if (user?.role === Role.User) {
    where.user = { id: user?.id };
  }

  if (status) {
    where.status = status;
  }

  return this.testDriveRepo.find({
    where,
    relations: ['car', 'user'],
    order: { date: 'DESC' },
  });
}
async bookTestDrive(carId: number, user: User, date: Date) {
  const car = await this.carRepository.findOne({ where: { id: String(carId) } });
  if (!car) throw new NotFoundException('Car not found');

  const testDrive = this.testDriveRepo.create({
    car,
    user,
    date,
    status: TestDriveStatus.Pending,
  });

  return this.testDriveRepo.save(testDrive);
}

async updateTestDriveStatus(id: number, status: 'accepted' | 'rejected') {
const testDrive = await this.testDriveRepo.findOne({ where: { id: id.toString() } });
  if (!testDrive) throw new NotFoundException('Test drive not found');

  testDrive.status = status as TestDriveStatus;
  return this.testDriveRepo.save(testDrive);
}

async getAllTestDrives() {
  return this.testDriveRepo.find({
    relations: ['car', 'user'],
    order: { date: 'DESC' },
  });
}
}
