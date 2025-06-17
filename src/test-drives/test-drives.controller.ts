// src/test-drive/test-drive.controller.ts
import { Controller, Post, UseGuards, Body, Req, Patch, Param, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TestDriveService } from './test-drives.service';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { Role } from 'src/common/enums/roles.enum';

@Controller('test-drives')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestDriveController {
  constructor(private readonly service: TestDriveService) {}

  @Post()
  @Roles(Role.User)
  requestTestDrive(@Body() dto: CreateTestDriveDto, @Req() req: any) {
    return this.service.request(dto, req.user);
  }

  @Get('manager')
  @Roles(Role.Manager)
  listManagerDrives(@Req() req: any) {
    return this.service.listForManager(req.user.id);
  }

  @Patch(':id/:status')
  @Roles(Role.Manager)
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.service.updateStatus(id, status as 'accepted' | 'rejected');
  }
}
