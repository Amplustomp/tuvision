export interface IPokemon {
  id:            number;
  name:        Nombre;
  type:          string[];
  base:    Base;
}

export interface Base {
  HP:   string;
  Attack:   string;
  Defense: string;
  'Sp. Attack': string;
  'Sp. Defense': string;
  Speed: string;
}

export interface Nombre {
  english: string;
  japanese: string;
  chinese: string;
  french : string;
}
