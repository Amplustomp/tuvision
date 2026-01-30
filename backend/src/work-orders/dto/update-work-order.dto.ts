import {
  IsEnum,
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
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  rut?: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}

class PurchaseDataDto {
  @IsNumber()
  @IsOptional()
  totalVenta?: number;

  @IsNumber()
  @IsOptional()
  abono?: number;

  @IsNumber()
  @IsOptional()
  saldo?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  formaPago?: PaymentMethod;

  @IsDateString()
  @IsOptional()
  fechaEntrega?: string;
}

export class UpdateWorkOrderDto {
  @IsEnum(WorkOrderType)
  @IsOptional()
  tipoOrden?: WorkOrderType;

  @ValidateNested()
  @Type(() => CustomerDataDto)
  @IsOptional()
  cliente?: CustomerDataDto;

  @ValidateNested()
  @Type(() => MedicalPrescriptionDto)
  @IsOptional()
  receta?: MedicalPrescriptionDto;

  @ValidateNested()
  @Type(() => PurchaseDataDto)
  @IsOptional()
  compra?: PurchaseDataDto;

  @IsDateString()
  @IsOptional()
  fechaVenta?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
