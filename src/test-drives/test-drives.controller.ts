import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TestDrivesService } from './test-drives.service';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('test-drives')
export class TestDrivesController {
  constructor(private readonly testDriveService: TestDrivesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post()
  request(@Body() dto: CreateTestDriveDto) {
    return this.testDriveService.request(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.testDriveService.approve(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.testDriveService.reject(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get()
  findAll() {
    return this.testDriveService.findAll();
  }
}
