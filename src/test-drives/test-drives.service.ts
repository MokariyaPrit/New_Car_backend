import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestDrive } from './entities/test-drive.entity';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { TestDriveStatus } from './entities/test-drive.entity';

@Injectable()
export class TestDrivesService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(TestDrive)
    private testDriveRepository: Repository<TestDrive>,
  ) {}


async request(dto: CreateTestDriveDto) {
  const testDrive = this.testDriveRepository.create({
    ...dto,
    status: TestDriveStatus.Pending,
  });
  return this.testDriveRepository.save(testDrive);
}

async approve(id: string) {
  const testDrive = await this.testDriveRepository.findOne({ where: { id } });
  if (!testDrive) throw new NotFoundException('Test Drive not found');
  testDrive.status = TestDriveStatus.Accepted;
  return this.testDriveRepository.save(testDrive);
}

async reject(id: string) {
  const testDrive = await this.testDriveRepository.findOne({ where: { id } });
  if (!testDrive) throw new NotFoundException('Test Drive not found');
  testDrive.status = TestDriveStatus.Rejected;
  return this.testDriveRepository.save(testDrive);
}

}
