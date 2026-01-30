import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user._id,
      email: user.email,
      nombre: user.nombre,
      role: user.role,
    };
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }

  async refreshToken(userId: string, email: string, role: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    const payload = {
      sub: userId,
      email: email,
      role: role,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
    const expiresInMs = this.parseExpiresIn(expiresIn);

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: expiresInMs,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
    };
  }

  getTokenExpiresIn(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
    return this.parseExpiresIn(expiresIn);
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 60 * 60 * 1000;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 60 * 60 * 1000;
    }
  }
}
