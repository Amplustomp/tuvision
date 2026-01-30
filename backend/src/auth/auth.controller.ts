import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../users/dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve token JWT',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Crea un nuevo usuario (solo administradores)',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores',
  })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil',
    description: 'Obtiene el perfil del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@CurrentUser() user: { userId: string }) {
    return this.authService.getProfile(user.userId);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refrescar token',
    description: 'Genera un nuevo token JWT para el usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado o token expirado' })
  refreshToken(
    @CurrentUser() user: { userId: string; email: string; role: string },
  ) {
    return this.authService.refreshToken(user.userId, user.email, user.role);
  }

  @Get('token-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Información del token',
    description: 'Obtiene información sobre la configuración del token',
  })
  @ApiResponse({ status: 200, description: 'Información del token' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getTokenInfo() {
    return {
      expires_in: this.authService.getTokenExpiresIn(),
    };
  }
}
