import { Expansion } from './expansion';
import { Rareza } from './rareza';
import { Tipo } from './tipo';

export class Carta {
  idCarta!: number;
  nombreCarta!: string;
  costeCarta!: number;
  urlImagen!: string;

  expansion!: Expansion;
  rareza!: Rareza;
  tipo!: Tipo;
}
