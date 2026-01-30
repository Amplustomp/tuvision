export type WorkOrderType = 'armazon' | 'lentes' | 'lente_completo';
export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta';

export interface Prescription {
  ojoDerecho: {
    esfera?: number;
    cilindro?: number;
    eje?: number;
    adicion?: number;
    distanciaPupilar?: number;
  };
  ojoIzquierdo: {
    esfera?: number;
    cilindro?: number;
    eje?: number;
    adicion?: number;
    distanciaPupilar?: number;
  };
}

export interface WorkOrder {
  _id: string;
  numeroOrden: number;
  tipo: WorkOrderType;
  cliente: {
    nombre: string;
    rut: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  };
  receta?: Prescription;
  armazon?: {
    marca?: string;
    modelo?: string;
    color?: string;
    precio?: number;
  };
  lentes?: {
    tipo?: string;
    material?: string;
    tratamientos?: string[];
    precio?: number;
  };
  abono?: number;
  total?: number;
  saldo?: number;
  formaPago?: PaymentMethod;
  observaciones?: string;
  estado?: string;
  creadoPor: string;
  actualizadoPor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderDto {
  tipo: WorkOrderType;
  cliente: {
    nombre: string;
    rut: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  };
  receta?: Prescription;
  armazon?: {
    marca?: string;
    modelo?: string;
    color?: string;
    precio?: number;
  };
  lentes?: {
    tipo?: string;
    material?: string;
    tratamientos?: string[];
    precio?: number;
  };
  abono?: number;
  total?: number;
  formaPago?: PaymentMethod;
  observaciones?: string;
}

export interface UpdateWorkOrderDto extends Partial<CreateWorkOrderDto> {
  estado?: string;
}
