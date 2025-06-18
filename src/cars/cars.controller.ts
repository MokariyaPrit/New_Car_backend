// src/cars/cars.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
  Get,
  Req,
  Patch,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';;
import { CarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createCar(
    @UploadedFile() image: Express.Multer.File,
    @Body() carDto: CarDto,
    @Request() req: any,
  ) {
    return this.carsService.createCarWithImage(carDto, image, req.user.id);
  }


   @Get()
  async getCars(@Req() req) {
    return this.carsService.findAllCarsForUser(req.user);
  }

  @Patch(':id')
  async updateCar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarDto,
    @Req() req
  ) {
    return this.carsService.updateCar(id, dto, req.user);
  }

  @Get(':id')
async getCarById(@Param('id') id: string) {
  return this.carsService.findOneById(id);
}
}
