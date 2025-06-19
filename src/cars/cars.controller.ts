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
  ParseUUIDPipe,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';;
import { CarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

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
  if (!image) throw new BadRequestException('Image is required');
  return this.carsService.createCarWithImage(carDto, image, req.user.id);
}

@Get()
async getCars(
  @Request() req: any,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  return this.carsService.findAllCarsForUser(req.user, +page, +limit);
}

@Patch(':id')
@UseInterceptors(FileInterceptor('image')) 
async updateCar(
  @Param('id', new ParseUUIDPipe()) id: string,
  @UploadedFile() image: Express.Multer.File,
  @Body() dto: UpdateCarDto,
  @Request() req: any,
) {
  return this.carsService.updateCar(id, dto, req.user, image);
}

  @Public()
  @Get('public')
  async getAllCarsForUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.carsService.findAllPublicCars(+page, +limit);
  }
  @Get(':id')
  async getCarById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.carsService.findOneById(id);
  }

@Post('bulk')
@Public() 
async createBulkCars(@Body() body:CarDto[]) {
  return this.carsService.createBulkCars(body);
}
 

}
