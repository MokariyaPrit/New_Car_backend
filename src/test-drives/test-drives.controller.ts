// src/test-drive/test-drive.controller.ts
import { Controller, Post, UseGuards, Body, Req, Patch, Param, Get, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TestDriveService } from './test-drives.service';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { Role } from 'src/common/enums/roles.enum';
import { TestDriveStatus } from './entities/test-drive.entity';
import { UpdateTestDriveStatusDto } from './dto/update-status.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('test-drives')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestDriveController {
  constructor(private readonly testDriveService: TestDriveService) {}


@UseGuards(JwtAuthGuard)
@Post()
requestDrive(@Body() dto: CreateTestDriveDto, @Req() req: any) {
  return this.testDriveService.requestDrive(dto, req.user);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Manager)
@Patch(':id/status')
updateStatus(@Param('id') id: string, @Body() dto: UpdateTestDriveStatusDto) {
  return this.testDriveService.updateStatus(id, dto.status);
}

@Get()
@UseGuards(JwtAuthGuard)
getAll() {
  return this.testDriveService.findAll();
}

@UseGuards(JwtAuthGuard)
@Post()
create(
  @Body() dto: CreateTestDriveDto,
  @CurrentUser() user: User, // Assume `@CurrentUser()` decorator gives logged-in user
) {
  return this.testDriveService.create(dto, user);
}


@Post(':carId')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.User)
bookTestDrive(
  @Param('carId', ParseIntPipe) carId: number,
  @CurrentUser() user: User,
  @Body() body: { date: string }, // ISO date string
) {
  return this.testDriveService.bookTestDrive(carId, user, new Date(body.date));
}

@Patch(':id/approve')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Manager, Role.Admin)
approveTestDrive(@Param('id', ParseIntPipe) id: number) {
  return this.testDriveService.updateTestDriveStatus(id, 'accepted');
}

@Patch(':id/reject')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Manager, Role.Admin)
rejectTestDrive(@Param('id', ParseIntPipe) id: number) {
  return this.testDriveService.updateTestDriveStatus(id, 'rejected');
}

@Get()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Manager, Role.Admin)
getAllTestDrives() {
  return this.testDriveService.getAllTestDrives();
}
}
