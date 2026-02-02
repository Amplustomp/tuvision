import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class EyeDataDto {
  @ApiPropertyOptional({ description: 'Esfera', example: '-2.50' })
  @IsString()
  @IsOptional()
  esfera?: string;

  @ApiPropertyOptional({ description: 'Cilindro', example: '-0.75' })
  @IsString()
  @IsOptional()
  cilindro?: string;

  @ApiPropertyOptional({ description: 'Eje', example: '180' })
  @IsString()
  @IsOptional()
  eje?: string;

  @ApiPropertyOptional({ description: 'Adicion', example: '+2.00' })
  @IsString()
  @IsOptional()
  adicion?: string;

  @ApiPropertyOptional({ description: 'Distancia Pupilar', example: '32' })
  @IsString()
  @IsOptional()
  distanciaPupilar?: string;
}

class LensDetailsDto {
  @ApiPropertyOptional({
    description: 'Tipo de cristal',
    example: 'Policarbonato',
  })
  @IsString()
  @IsOptional()
  cristal?: string;

  @ApiPropertyOptional({ description: 'Codigo del cristal', example: 'PC-001' })
  @IsString()
  @IsOptional()
  codigo?: string;

  @ApiPropertyOptional({
    description: 'Color del cristal',
    example: 'Transparente',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Marca del armazon', example: 'Ray-Ban' })
  @IsString()
  @IsOptional()
  armazonMarca?: string;
}

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'RUT del cliente', example: '12.345.678-9' })
  @IsString()
  @IsNotEmpty()
  clienteRut: string;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty()
  clienteNombre: string;

  @ApiPropertyOptional({
    description: 'Telefono del cliente',
    example: '+56912345678',
  })
  @IsString()
  @IsOptional()
  clienteTelefono?: string;

  @ApiPropertyOptional({
    description: 'Datos del ojo derecho',
    type: EyeDataDto,
  })
  @ValidateNested()
  @Type(() => EyeDataDto)
  @IsOptional()
  ojoDerecho?: EyeDataDto;

  @ApiPropertyOptional({
    description: 'Datos del ojo izquierdo',
    type: EyeDataDto,
  })
  @ValidateNested()
  @Type(() => EyeDataDto)
  @IsOptional()
  ojoIzquierdo?: EyeDataDto;

  @ApiPropertyOptional({
    description: 'Detalles de lentes',
    type: LensDetailsDto,
  })
  @ValidateNested()
  @Type(() => LensDetailsDto)
  @IsOptional()
  detallesLentes?: LensDetailsDto;

  @ApiPropertyOptional({
    description: 'Observaciones',
    example: 'Paciente con astigmatismo',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
