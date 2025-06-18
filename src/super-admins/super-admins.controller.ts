// src/super-admins/super-admins.controller.ts
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SuperAdminsService } from './super-admins.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateRoleDto } from 'src/users/dto/update-role.dto';

@Controller('super-admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class SuperAdminsController {
  constructor(private readonly superAdminsService: SuperAdminsService) {}

  // ✅ Get all users
  @Get('users')
  getAllUsers() {
    return this.superAdminsService.findAllUsers();
  }

  // ✅ Update user profile (by superadmin)
  @Patch('users/:id')
  updateUserProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: any,
  ) {
    return this.superAdminsService.updateUser(id, dto);
  }

  // ✅ Delete any user
  @Delete('users/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.superAdminsService.deleteUser(id);
  }

  // ✅ Update any user's role
  @Patch('users/:id/role')
  updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.superAdminsService.updateUserRole(id, dto.role);
  }
}
