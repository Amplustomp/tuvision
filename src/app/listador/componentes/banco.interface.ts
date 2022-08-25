export interface IBanco {
  nombre:        string;
  direccion:          string;
  telefono:     string;
  sucursales:     Surcursal;
}

export interface Surcursal {
  nombre:   string;
  direccion:   string;
  telefono: string;
}
