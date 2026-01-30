import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'vendedor@tuvision.cl',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 6 caracteres)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'RUT del usuario',
    example: '12.345.678-9',
  })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    enum: Role,
    default: Role.VENDEDOR,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
