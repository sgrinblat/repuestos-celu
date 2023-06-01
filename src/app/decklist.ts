import { DeckListCarta } from "./deckListCarta";

export class Decklist {
  id!: number;
  nombreDecklist!: string;
  portadaDecklist!: string;
  fechaDecklist!: Date;

  jugador!: string;

  reino!: DeckListCarta[];
  boveda!: DeckListCarta[];
  sidedeck!: DeckListCarta[];

}
