export class Bancos {
  bancos!:      Banco;
}

export class Banco {
  nombre!:      string;
  direccion!:   string;
  telefono!:    string;
  sucursales?:  Sucursales[];
}

export class Sucursales {
  nombre!:      string;
  direccion!:   string;
  telefono!:    string;
}
