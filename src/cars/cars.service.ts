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

    const uploadResult: { secure_url: string } | string = await this.cloudinaryService.uploadImage(image);

    const imageUrl = typeof uploadResult === 'string' ? uploadResult : uploadResult.secure_url;

    const newCar = this.carRepository.create({
      ...carDto,
      imageUrl: imageUrl,
      owner: owner, // explicitly assign owner after null check
    });

    return this.carRepository.save(newCar);
  }

async findAllCarsForUser(user: any, page = 1, limit = 10) {
  let whereClause: any = {};

  if (user.role === Role.Manager) {
    whereClause = { owner: { id: user.id } };
  } else if (user.role === Role.Admin) {
    whereClause = { owner: { region: user.region } };
  } else {
    throw new ForbiddenException('Access Denied');
  }

  const [cars, total] = await this.carRepository.findAndCount({
    where: whereClause,
    relations: ['owner'],
    order: { createdAt: 'DESC' },
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    data: cars,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

async updateCar(
  id: string,
  updateCarDto: UpdateCarDto,
  user: any,
  image?: Express.Multer.File
) {
  const car = await this.carRepository.findOne({
    where: { id },
    relations: ['owner'],
  });

  if (!car) throw new NotFoundException('Car not found');

  if (user.role === Role.Manager && car.owner.id !== user.id) {
    throw new ForbiddenException('Managers can only update their own cars');
  }

  if (user.role === Role.Admin && car.owner.region !== user.region) {
    throw new ForbiddenException('Admins can only update cars in their region');
  }

 if (image) {
  const uploaded = await this.cloudinaryService.uploadImage(image);
  updateCarDto.imageUrl = uploaded.secure_url;
}

//  Prevent overriding relations by accident
if ('owner' in updateCarDto) delete updateCarDto.owner;

Object.assign(car, updateCarDto);
return this.carRepository.save(car);
}

  async findOneById(id: string) {
  const car = await this.carRepository.findOne({
    where: { id },
  });
  if (!car) throw new NotFoundException('Car not found');
  return car;
}

async createBulkCars(carDtos: CarDto[]) {
  const cars = await Promise.all(
    carDtos.map(async (dto) => {
      const owner = await this.usersService.findById(dto.ownerId);
      if (!owner) throw new Error(`Owner not found for ID: ${dto.ownerId}`);
      const { ownerId, ...rest } = dto;
      return this.carRepository.create({ ...rest, owner });
    }),
  );

  return this.carRepository.save(cars);
}


async findAllPublicCars(page: number, limit: number) {
  const [cars, total] = await this.carRepository.findAndCount({
    relations: ['owner'],
    order: { createdAt: 'DESC' },
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    data: cars.map(car => ({
      id: car.id,
      model: car.model,
      year: car.year,
      color: car.color,
      imageUrl: car.imageUrl,
      price: car.price,
      mileage: car.mileage,
      owner: {
        id: car.owner.id,
        region: car.owner.region,
      },
    })),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

}
