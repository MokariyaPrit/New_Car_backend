import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // ...add custom update fields or overrides if needed...

   @IsString()
    @ApiProperty({ example: '123456789' })
    phone: number;
}
