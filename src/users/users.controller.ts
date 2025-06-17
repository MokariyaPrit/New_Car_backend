// src/users/users.controller.ts
import { Controller, Get, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
