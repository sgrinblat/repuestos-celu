import { Carta } from "./carta";

export class Decklist {
  public id!: number;
  public nombreDecklist!: string;
  public fechaDecklist!: Date;

  public jugador!: string;

  public lista!: Carta[];


}
