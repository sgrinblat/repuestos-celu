import { Carta } from "./carta";

export class Decklist {
  id!: number;
  nombreDecklist!: string;
  fechaDecklist!: Date;

  jugador!: string;

  reino!: Carta[];
  boveda!: Carta[];
  sideck!: Carta[];


}
