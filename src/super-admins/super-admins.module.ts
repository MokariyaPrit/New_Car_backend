import { Module } from '@nestjs/common';
import { SuperAdminsController } from './super-admins.controller';
import { SuperAdminsService } from './super-admins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SuperAdminsController],
  providers: [SuperAdminsService],
})
export class SuperAdminsModule {}
