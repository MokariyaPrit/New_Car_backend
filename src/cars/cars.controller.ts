// src/cars/cars.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/common/enums/roles.enum';

@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarsController {
  constructor(private readonly carService: CarsService) {}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Manager)
@Post()
createCar(@Body() dto: CreateCarDto, @Req() req: any) {
  return this.carService.create(dto, req.user);
}

  @Get('my')
  @Roles(Role.Manager)
  getMyCars(@Req() req: any) {
    return this.carService.findAllByManager(req.user.id);
  }
}
