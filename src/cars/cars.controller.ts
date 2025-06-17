import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin, Role.SuperAdmin)
  @Post()
  create(@Body() dto: CreateCarDto) {
    return this.carsService.create(dto);
  }

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager, Role.Admin, Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
