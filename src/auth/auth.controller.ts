import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

// Extend Express Request interface to include 'user'
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
@Public()
@Post('signup')
async signup(@Body() dto: SignupDto) {
  return this.authService.signup(dto);
}

@Public()
@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}

@Public()
@Post('refresh')
@UseGuards(RefreshGuard)
async refresh(@Req() req: Request) {
  const user = req.user as any;
  return this.authService.generateTokens(user.sub, user.email);
}
 
}
