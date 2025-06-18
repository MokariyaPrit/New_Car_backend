import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
