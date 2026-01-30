import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'nuevo@tuvision.cl',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña (mínimo 6 caracteres)',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'María García',
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'RUT del usuario',
    example: '98.765.432-1',
  })
  @IsString()
  @IsOptional()
  rut?: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
