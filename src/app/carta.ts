import { Expansion } from './expansion';
import { Rareza } from './rareza';
import { Tipo } from './tipo';

export class Carta {
  idCarta!: number;
  nombreCarta!: string;
  costeCarta!: number;
  urlImagen!: string;
  textoCarta!: string;
  flavorCarta!: string;
  rulingCarta!: string;

  urlImagen1!: string;
  urlImagen2!: string;
  urlImagen3!: string;
  urlImagen4!: string;
  urlImagen5!: string;

  expansion!: Expansion;
  rareza!: Rareza;
  tipo!: Tipo;
}
