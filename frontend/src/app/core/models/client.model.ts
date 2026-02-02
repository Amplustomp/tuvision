export interface Client {
  _id: string;
  rut: string;
  nombre: string;
  telefono?: string;
  email?: string;
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

export interface CreateClientDto {
  rut: string;
  nombre: string;
  telefono?: string;
  email?: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;
