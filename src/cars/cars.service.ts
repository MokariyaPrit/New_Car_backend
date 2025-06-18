// src/cars/cars.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { UsersService } from 'src/users/users.service';
import { CarDto } from './dto/create-car.dto';
import { Role } from 'src/common/enums/roles.enum';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async createCarWithImage(
    carDto: CarDto,
    image: Express.Multer.File,
    userId: string,
  ): Promise<Car> {
    const owner = await this.usersService.findById(userId);
    if (!owner) {
      throw new Error('Owner not found');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(image);

    const newCar = this.carRepository.create({
      ...carDto,
      imageUrl: uploadResult.secure_url,
      owner: owner, // explicitly assign owner after null check
    });

    return this.carRepository.save(newCar);
  }

   async findAllCarsForUser(user: any) {
    if (user.role === Role.Manager) {
      return this.carRepository.find({
        where: { owner: { id: user.id } },
      });
    } else if (user.role === Role.Admin) {
      return this.carRepository.find({
        where: { owner: { region: user.region } },
      });
    }
    throw new ForbiddenException('Access Denied');
  }

  async updateCar(id: number, updateCarDto: UpdateCarDto, user: any) {
    const car = await this.carRepository.findOne({
      where: { id: id.toString() },
      relations: ['owner'],
    });

    if (!car) throw new NotFoundException('Car not found');

    if (user.role === Role.Manager && car.owner.id !== user.id) {
      throw new ForbiddenException('Managers can only update their own cars');
    }

    if (user.role === Role.Admin && car.owner.region !== user.region) {
      throw new ForbiddenException('Admin can only update cars in their region');
    }

    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async findOneById(id: string) {
  const car = await this.carRepository.findOne({
    where: { id },
    relations: ['owner'],
  });
  if (!car) throw new NotFoundException('Car not found');
  return car;
}
}
