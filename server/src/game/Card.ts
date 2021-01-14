import { CARD_SUM_VALUE, CardSuit, CardType } from "../constant/cardConstants";
import { isset } from "../helpers/extras";

class Card {
  public readonly suit: CardSuit;
  public readonly name: string;
  public readonly value: number;

  constructor( suit: CardSuit, name: string, value: number ) {
    this.suit = suit;
    this.name = name;
    this.value = value;
  }

  equals( card: Card ): boolean {
    if ( !isset( card ) ) {
      return false;
    }
    console.log( card );
    return this.suit === card.suit && this.name === card.name;
  }

  canTakeCards( cards: Card[] ): boolean {
    if ( cards.length === 1 && cards[ 0 ].value >= 12 && cards[ 0 ].name === this.name ) {
      return true;
    }

    const sumValue = cards.reduce( ( accumulator, currentValue ) =>
      accumulator + currentValue.value, 0 ) + this.value;
    if ( sumValue === CARD_SUM_VALUE ) {
      return true;
    }

    if ( this.value === CardType.JACK ) {
      const paintedCards = cards.filter( card => card.value > CardType.JACK );
      const paintedCardsSum = paintedCards.reduce( ( accumulator, card ) =>
        [ CardSuit.SPADES, CardSuit.CLUBS ].includes( card.suit ) ?
          accumulator - card.value : accumulator + card.value, 0 );

      return paintedCardsSum === 0;
    }

    return false;
  }

}

export { Card };