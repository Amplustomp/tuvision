export type PrescriptionType = 'lejos' | 'cerca';

export interface EyeData {
  esfera?: string;
  cilindro?: string;
  eje?: string;
  adicion?: string;
}

export interface Prescription {
  _id: string;
  clienteRut: string;
  clienteNombre: string;
  clienteTelefono?: string;
  tipo: PrescriptionType;
  ojoDerecho?: EyeData;
  ojoIzquierdo?: EyeData;
  distanciaPupilar?: string;
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

export interface CreatePrescriptionDto {
  clienteRut: string;
  clienteNombre: string;
  clienteTelefono?: string;
  tipo: PrescriptionType;
  ojoDerecho?: EyeData;
  ojoIzquierdo?: EyeData;
  distanciaPupilar?: string;
  observaciones?: string;
}

export interface CreatePrescriptionResult {
  prescription: Prescription;
  isNew: boolean;
  message?: string;
}

export type UpdatePrescriptionDto = Partial<CreatePrescriptionDto>;
