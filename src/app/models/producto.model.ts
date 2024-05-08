import { Image } from "./image";

export interface Producto {
  id: number;
  title: string;
  price: number;
  image: string;
  images: Image;
  state: string;
  city: string;
  short_description: string;
  long_description: string;
  disponible: number;
}
