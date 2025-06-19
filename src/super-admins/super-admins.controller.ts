import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { SuperAdminsService } from './super-admins.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('super-admins')
export class SuperAdminsController {
  constructor(private readonly superAdminsService: SuperAdminsService) {}

  //   List all users
  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.superAdminsService.getAllUsers();
  }

  //   Update any user
  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.superAdminsService.updateUser(id, updateUserDto);
  }

  //   Delete any user
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.superAdminsService.deleteUser(id);
  }
}
