// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/common/enums/roles.enum';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

async createUser(dto: CreateUserDto): Promise<User> {
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const user = this.userRepository.create({
    ...dto,
    password: hashedPassword,
  });
  return this.userRepository.save(user);
}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password', 'role'], });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUserRole(userId: number, newRole: Role): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId.toString() } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = newRole;
    return this.userRepository.save(user);
  }


async updateRefreshToken(userId: string, token: string): Promise<void> {
  await this.userRepository.update(userId, { RefreshToken: token });
}


async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  const updatedUser = this.userRepository.merge(user, updateUserDto);
  return this.userRepository.save(updatedUser);
}

}
