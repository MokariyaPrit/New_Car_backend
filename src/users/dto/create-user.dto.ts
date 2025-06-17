// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
  

  @IsNotEmpty()
  @ApiProperty({ example: 'user' })
    role: Role;
}
