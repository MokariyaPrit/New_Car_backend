// src/cars/entities/car.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  Brand: string; // Brand like "Jaguar Golf"


  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  color: string;

  @Column({ unique: true })
  Number: string; // Car number like FN61XTE

  @Column()
  type: string; // Like Coupe, SUV, Sedan

  @Column()
  transmission: string; // Automatic / Manual

  @Column()
  fuelType: string; // Petrol / Diesel / Hybrid

  @Column()
  mileage: number; // e.g., 87

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // e.g., 66094.00

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.cars, { eager: true })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
