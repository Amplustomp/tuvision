export interface EyeData {
  esfera?: string;
  cilindro?: string;
  eje?: string;
  adicion?: string;
  distanciaPupilar?: string;
}

export interface LensDetails {
  cristal?: string;
  codigo?: string;
  color?: string;
  armazonMarca?: string;
}

export interface Prescription {
  _id: string;
  clienteRut: string;
  clienteNombre: string;
  clienteTelefono?: string;
  ojoDerecho?: EyeData;
  ojoIzquierdo?: EyeData;
  detallesLentes?: LensDetails;
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
  ojoDerecho?: EyeData;
  ojoIzquierdo?: EyeData;
  detallesLentes?: LensDetails;
  observaciones?: string;
}

export type UpdatePrescriptionDto = Partial<CreatePrescriptionDto>;
