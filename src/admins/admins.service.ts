import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsersByRegion(region: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        region,
        role: Role.User,
      },
    });
  }

  async getManagersByRegion(region: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        region,
        role: Role.Manager,
      },
    });
  }

  async getUsersAndManagersByRegion(region: string) {
    const [users, managers] = await Promise.all([
      this.userRepository.find({ where: { region, role: Role.User } }),
      this.userRepository.find({ where: { region, role: Role.Manager } }),
    ]);

    return {
      region,
      users,
      managers,
    };
  }
}
