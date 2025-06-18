import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    if (!user || !user.id) throw new Error('User or ID is undefined');

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async generateAccessToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRY'),
    });
  }

  async generateRefreshToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRY'),
    });
  }


  async refreshToken(token: string) {
  try {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.RefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = await bcrypt.compare(token, user.RefreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const newAccessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    // Save new hashed refresh token
    const hashed = await bcrypt.hash(newRefreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashed);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  } catch (err) {
    console.error('Refresh error:', err);
    throw new UnauthorizedException('Token expired or invalid');
  }
}

async logout(userId: string): Promise<void> {
  const user = await this.usersService.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await this.usersService.updateRefreshToken(userId, '');
}
}
