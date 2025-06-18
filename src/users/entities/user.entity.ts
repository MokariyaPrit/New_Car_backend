// src/users/entities/user.entity.ts
import { Role } from 'src/common/enums/roles.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TestDrive } from 'src/test-drives/entities/test-drive.entity';
import { Car } from 'src/cars/entities/car.entity';

export type UserRole = 'user' | 'manager' | 'admin' | 'superadmin';

@Entity('users')
export class User { 
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ 
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

@OneToMany(() => TestDrive, (td) => td.user)
testDrives: TestDrive[];

@OneToMany(() => Car, (car) => car.manager)
cars: Car[];


@Column({ nullable: true })
RefreshToken?: string;
}
