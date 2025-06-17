// src/test-drive/entities/test-drive.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TestDrive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car)
  car: Car;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 'pending' }) // pending | accepted | rejected
  status: string;

  @CreateDateColumn()
  requestedAt: Date;
}
