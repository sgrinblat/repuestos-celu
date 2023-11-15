import { Expansion } from './expansion';
import { Rareza } from './rareza';
import { Tipo } from './tipo';
import { Subtipo } from './subtipo';

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
  urlImagen6!: string;
  urlImagen7!: string;
  urlImagen8!: string;
  urlImagen9!: string;
  urlImagen10!: string;

  expansion!: Expansion;
  rareza!: Rareza;
  tipo!: Tipo;

  subtipo!: Subtipo;
  subtipo2!: Subtipo;
  subtipo3!: Subtipo;
  subtipo4!: Subtipo;
}


