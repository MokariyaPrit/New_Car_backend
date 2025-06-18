import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ManagersController],
  providers: [
    ManagersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ManagersModule {}
