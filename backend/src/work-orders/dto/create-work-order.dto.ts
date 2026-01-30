import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, WorkOrderType } from '../../common/enums';

class EyePrescriptionDto {
  @IsString()
  @IsOptional()
  esfera?: string;

  @IsString()
  @IsOptional()
  cilindro?: string;

  @IsString()
  @IsOptional()
  grado?: string;
}

class PrescriptionDistanceDto {
  @ValidateNested()
  @Type(() => EyePrescriptionDto)
  @IsOptional()
  od?: EyePrescriptionDto;

  @ValidateNested()
  @Type(() => EyePrescriptionDto)
  @IsOptional()
  oi?: EyePrescriptionDto;
}

class LensDetailsDto {
  @IsString()
  @IsOptional()
  dp?: string;

  @IsString()
  @IsOptional()
  cristal?: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  armazonMarca?: string;
}

class MedicalPrescriptionDto {
  @ValidateNested()
  @Type(() => PrescriptionDistanceDto)
  @IsOptional()
  lejos?: PrescriptionDistanceDto;

  @ValidateNested()
  @Type(() => PrescriptionDistanceDto)
  @IsOptional()
  cerca?: PrescriptionDistanceDto;

  @IsString()
  @IsOptional()
  add?: string;

  @ValidateNested()
  @Type(() => LensDetailsDto)
  @IsOptional()
  detallesLejos?: LensDetailsDto;

  @ValidateNested()
  @Type(() => LensDetailsDto)
  @IsOptional()
  detallesCerca?: LensDetailsDto;
}

class CustomerDataDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}

class PurchaseDataDto {
  @IsNumber()
  @IsNotEmpty()
  totalVenta: number;

  @IsNumber()
  @IsOptional()
  abono?: number;

  @IsNumber()
  @IsNotEmpty()
  saldo: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  formaPago: PaymentMethod;

  @IsDateString()
  @IsOptional()
  fechaEntrega?: string;
}

export class CreateWorkOrderDto {
  @IsEnum(WorkOrderType)
  @IsNotEmpty()
  tipoOrden: WorkOrderType;

  @ValidateNested()
  @Type(() => CustomerDataDto)
  @IsNotEmpty()
  cliente: CustomerDataDto;

  @ValidateNested()
  @Type(() => MedicalPrescriptionDto)
  @IsOptional()
  receta?: MedicalPrescriptionDto;

  @ValidateNested()
  @Type(() => PurchaseDataDto)
  @IsNotEmpty()
  compra: PurchaseDataDto;

  @IsDateString()
  @IsNotEmpty()
  fechaVenta: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
