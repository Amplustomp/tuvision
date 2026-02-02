import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentMethod,
  WorkOrderType,
  OrderNumberType,
} from '../../common/enums';

class EyePrescriptionDto {
  @ApiPropertyOptional({ description: 'Esfera', example: '-2.00' })
  @IsString()
  @IsOptional()
  esfera?: string;

  @ApiPropertyOptional({ description: 'Cilindro', example: '-0.50' })
  @IsString()
  @IsOptional()
  cilindro?: string;

  @ApiPropertyOptional({ description: 'Grado/Eje', example: '180' })
  @IsString()
  @IsOptional()
  grado?: string;
}

class PrescriptionDistanceDto {
  @ApiPropertyOptional({ description: 'Ojo Derecho', type: EyePrescriptionDto })
  @ValidateNested()
  @Type(() => EyePrescriptionDto)
  @IsOptional()
  od?: EyePrescriptionDto;

  @ApiPropertyOptional({
    description: 'Ojo Izquierdo',
    type: EyePrescriptionDto,
  })
  @ValidateNested()
  @Type(() => EyePrescriptionDto)
  @IsOptional()
  oi?: EyePrescriptionDto;
}

class LensDetailsDto {
  @ApiPropertyOptional({ description: 'Distancia pupilar', example: '63' })
  @IsString()
  @IsOptional()
  dp?: string;

  @ApiPropertyOptional({
    description: 'Tipo de cristal',
    example: 'Policarbonato',
  })
  @IsString()
  @IsOptional()
  cristal?: string;

  @ApiPropertyOptional({ description: 'Código del cristal', example: 'PC-001' })
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

  @ApiPropertyOptional({
    description: 'Marca del armazón',
    example: 'Ray-Ban RB5154',
  })
  @IsString()
  @IsOptional()
  armazonMarca?: string;
}

class MedicalPrescriptionDto {
  @ApiPropertyOptional({
    description: 'Receta para lejos',
    type: PrescriptionDistanceDto,
  })
  @ValidateNested()
  @Type(() => PrescriptionDistanceDto)
  @IsOptional()
  lejos?: PrescriptionDistanceDto;

  @ApiPropertyOptional({
    description: 'Receta para cerca',
    type: PrescriptionDistanceDto,
  })
  @ValidateNested()
  @Type(() => PrescriptionDistanceDto)
  @IsOptional()
  cerca?: PrescriptionDistanceDto;

  @ApiPropertyOptional({ description: 'Adición', example: '+2.00' })
  @IsString()
  @IsOptional()
  add?: string;

  @ApiPropertyOptional({
    description: 'Detalles de lentes para lejos',
    type: LensDetailsDto,
  })
  @ValidateNested()
  @Type(() => LensDetailsDto)
  @IsOptional()
  detallesLejos?: LensDetailsDto;

  @ApiPropertyOptional({
    description: 'Detalles de lentes para cerca',
    type: LensDetailsDto,
  })
  @ValidateNested()
  @Type(() => LensDetailsDto)
  @IsOptional()
  detallesCerca?: LensDetailsDto;
}

class CustomerDataDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'RUT del cliente', example: '12.345.678-9' })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiPropertyOptional({
    description: 'Teléfono del cliente',
    example: '+56912345678',
  })
  @IsString()
  @IsOptional()
  telefono?: string;
}

class PurchaseDataDto {
  @ApiProperty({ description: 'Total de la venta', example: 150000 })
  @IsNumber()
  @IsNotEmpty()
  totalVenta: number;

  @ApiPropertyOptional({ description: 'Abono inicial', example: 50000 })
  @IsNumber()
  @IsOptional()
  abono?: number;

  @ApiProperty({ description: 'Saldo pendiente', example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  saldo: number;

  @ApiProperty({
    description: 'Forma de pago',
    enum: PaymentMethod,
    example: PaymentMethod.TARJETA,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  formaPago: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Fecha de entrega',
    example: '2026-02-15',
  })
  @IsDateString()
  @IsOptional()
  fechaEntrega?: string;
}

export class CreateWorkOrderDto {
  @ApiProperty({
    description: 'Tipo de numero de orden',
    enum: OrderNumberType,
    example: OrderNumberType.TU_VISION,
  })
  @IsEnum(OrderNumberType)
  @IsNotEmpty()
  tipoNumeroOrden: OrderNumberType;

  @ApiPropertyOptional({
    description: 'Numero de orden manual (con prefijo #)',
    example: '#12345',
  })
  @IsString()
  @IsOptional()
  numeroOrdenManual?: string;

  @ApiProperty({
    description: 'Tipo de orden',
    enum: WorkOrderType,
    example: WorkOrderType.LENTE_COMPLETO,
  })
  @IsEnum(WorkOrderType)
  @IsNotEmpty()
  tipoOrden: WorkOrderType;

  @ApiProperty({ description: 'Datos del cliente', type: CustomerDataDto })
  @ValidateNested()
  @Type(() => CustomerDataDto)
  @IsNotEmpty()
  cliente: CustomerDataDto;

  @ApiPropertyOptional({
    description: 'ID de la receta medica asociada',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsOptional()
  recetaId?: string;

  @ApiPropertyOptional({
    description: 'Receta medica (opcional para armazon)',
    type: MedicalPrescriptionDto,
  })
  @ValidateNested()
  @Type(() => MedicalPrescriptionDto)
  @IsOptional()
  receta?: MedicalPrescriptionDto;

  @ApiProperty({ description: 'Datos de la compra', type: PurchaseDataDto })
  @ValidateNested()
  @Type(() => PurchaseDataDto)
  @IsNotEmpty()
  compra: PurchaseDataDto;

  @ApiProperty({ description: 'Fecha de venta', example: '2026-01-30' })
  @IsDateString()
  @IsNotEmpty()
  fechaVenta: string;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales',
    example: 'Cliente prefiere entrega en la tarde',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
