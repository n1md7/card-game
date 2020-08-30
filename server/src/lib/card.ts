import { CardType, CARD_SUM_VALUE } from "./constants";

class Card {
  private readonly suit: string;
  private readonly name: string;
  private readonly value: number;

  constructor( suit: string, name: string, value: number ) {
    this.suit = suit;
    this.name = name;
    this.value = value;
  }

  canTakeCards( cards: Card[] ) {
    if ( cards.length === 1 && cards[ 0 ].value >= 12 && cards[ 0 ].name === this.name )
      return true;

    const sumValue = cards.reduce( ( accumulator, currentValue ) => accumulator + currentValue.value, 0 ) + this.value;
    if ( sumValue === CARD_SUM_VALUE )
      return true;

    if ( this.value === CardType.JACK ) {
      const paintedCards = cards.filter( card => card.value > CardType.JACK);
      return paintedCards.length === 4 || ( paintedCards.length === 2 && paintedCards[ 0 ].value === paintedCards[ 1 ].value );
    }

    return false;
  }
}

export {Card};