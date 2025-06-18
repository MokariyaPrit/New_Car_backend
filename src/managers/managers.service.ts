import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsersByRegion(region: string) {
    return this.userRepository.find({
      where: { region, role: Role.User },
    });
  }
}
