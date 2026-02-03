import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionType } from '../../common/enums';

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

  @ApiProperty({
    description: 'Tipo de receta',
    enum: PrescriptionType,
    example: PrescriptionType.LEJOS,
  })
  @IsEnum(PrescriptionType)
  @IsNotEmpty()
  tipo: PrescriptionType;

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
    description: 'Distancia Pupilar',
    example: '63',
  })
  @IsString()
  @IsOptional()
  distanciaPupilar?: string;

  @ApiPropertyOptional({
    description: 'Observaciones',
    example: 'Paciente con astigmatismo',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
