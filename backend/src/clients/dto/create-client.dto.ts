import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'RUT del cliente', example: '12.345.678-9' })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Teléfono del cliente',
    example: '+56912345678',
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Email del cliente',
    example: 'cliente@ejemplo.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
