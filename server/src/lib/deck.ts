import { Card } from "./card";
import { cardSuitsByName, cardTypesByName } from "./constants";

function getRandomInt( max: number ) {
  return Math.floor( Math.random() * Math.floor( max ) );
}

class Deck {
  private readonly cards: Card[];

  constructor() {
    this.cards = [];
    for ( const suitName in cardSuitsByName ) {
      if ( suitName in cardSuitsByName ) {
        cardTypesByName.forEach((cardType, name) => {
            this.cards.push( new Card( suitName, name, cardType ) );
        })
      }
    }
    this.shuffle();
  }

  shuffle() {
    const N = this.cards.length;
    for ( let i = 0; i < N; i++ ) {
      const r = i + getRandomInt( N - i );
      const temp = this.cards[ r ];
      this.cards[ i ] = this.cards[ r ];
      this.cards[ r ] = temp;
    }
  }

  getCards( count: number ) {
    if ( this.cards.length < count )
      throw new Error( "Not enough cards in deck!" )
    return this.cards.splice( 0, count );
  }
}

export default Deck;