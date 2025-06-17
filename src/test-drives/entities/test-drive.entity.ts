// src/test-drives/entities/test-drive.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';



export enum TestDriveStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

@Entity()
export class TestDrive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'enum', enum: TestDriveStatus, default: TestDriveStatus.Pending })
  status: TestDriveStatus;

  @ManyToOne(() => Car, (car) => car.testDrives, { eager: true })
  car: Car;

  @ManyToOne(() => User, (user) => user.testDrives, { eager: true })
  user: User;
}
