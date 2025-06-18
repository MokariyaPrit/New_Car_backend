import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Extend Express Request interface to include 'user'
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@Post('login')
@UseGuards(LocalAuthGuard)
async login(@Req() req: any) {
  //   console.log(req.user); // Add this to debug
  //   console.log('LocalStrategy validated user:', req.user);
  // console.log('Request user in controller:', req.user);
  return this.authService.login(req.user);
  // @UseGuards(LocalAuthGuard)
}

@Post('refresh-token')
  async refreshToken(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as any; // or create a custom type for req.user
    await this.authService.logout(user.sub); // sub = userId
    return { message: 'Logged out successfully' };
  }
}
