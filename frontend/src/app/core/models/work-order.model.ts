import { Client } from './client.model';
import { Prescription } from './prescription.model';

export type WorkOrderType = 'armazon' | 'lentes' | 'lente_completo';
export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta';
export type OrderNumberType = 'tu_vision' | 'opticolors' | 'optiva_vr';

export interface EyePrescriptionData {
  esfera?: string;
  cilindro?: string;
  grado?: string;
}

export interface PrescriptionDistance {
  od?: EyePrescriptionData;
  oi?: EyePrescriptionData;
}

export interface LensDetailsData {
  dp?: string;
  cristal?: string;
  codigo?: string;
  color?: string;
  armazonMarca?: string;
}

export interface MedicalPrescription {
  lejos?: PrescriptionDistance;
  cerca?: PrescriptionDistance;
  add?: string;
  detallesLejos?: LensDetailsData;
  detallesCerca?: LensDetailsData;
}

export interface PurchaseData {
  totalVenta: number;
  abono?: number;
  saldo: number;
  formaPago: PaymentMethod;
  fechaEntrega?: string;
}

export interface WorkOrder {
  _id: string;
  numeroOrden: number;
  numeroOrdenManual?: string;
  tipoNumeroOrden: OrderNumberType;
  tipoOrden: WorkOrderType;
  clienteId: Client | string;
  recetaLejosId?: Prescription | string;
  recetaCercaId?: Prescription | string;
  receta?: MedicalPrescription;
  compra: PurchaseData;
  fechaVenta: string;
  observaciones?: string;
  creadoPor: {
    _id: string;
    nombre: string;
    email: string;
  };
  actualizadoPor?: {
    _id: string;
    nombre: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderDto {
  tipoNumeroOrden: OrderNumberType;
  numeroOrdenManual?: string;
  tipoOrden: WorkOrderType;
  clienteId: string;
  recetaLejosId?: string;
  recetaCercaId?: string;
  receta?: MedicalPrescription;
  compra: PurchaseData;
  fechaVenta: string;
  observaciones?: string;
}

export type UpdateWorkOrderDto = Partial<CreateWorkOrderDto>;
