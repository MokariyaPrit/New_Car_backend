import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { SuperAdminsModule } from './super-admins/super-admins.module';
import { AdminsModule } from './admins/admins.module';
import { ManagersModule } from './managers/managers.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { CarsModule } from './cars/cars.module';
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CloudinaryModule
  ],
  imports: [
    UsersModule,
    SuperAdminsModule,
    AdminsModule,
    ManagersModule,
    CarsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
         entities: [__dirname + '/**/*.entity{.ts,.js}'], // put your entity classes here
        synchronize: true,
        
      }),
    }),
  ],
})
export class AppModule {}
