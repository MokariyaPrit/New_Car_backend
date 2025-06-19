import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class SuperAdminsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //   Get all users
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  //   Update any user
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updated);
  }

  //   Delete any user
  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
    return { message: `User with ID ${id} deleted successfully.` };
  }
}
