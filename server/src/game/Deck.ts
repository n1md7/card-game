import { Card } from "./Card";
import { cardSuitsByName, cardTypesByName } from "../constant/cardConstants";
import { getRandomInt } from "../helpers/extras";

export default class Deck {
  private readonly cards: Card[];

  constructor() {
    this.cards = [];
    cardSuitsByName.forEach( ( suitType, suitName ) => {
      cardTypesByName.forEach( ( cardType, name ) => {
        this.cards.push( new Card( suitType, name, cardType ) );
      } );
    } );
    this.shuffle();
  }

  isEmpty() {
    return this.cards.length === 0;
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
    if ( this.cards.length < count ) {
      throw new Error( "Not enough cards in deck!" );
    }

    return this.cards.splice( 0, count );
  }

  containsCards( cards: Card[] ) {
    for ( const card of cards ) {
      // FIXME: improve this
      if ( this.cards.find( c => c.equals( card ) ) === undefined )
        return false;
    }
    return true;
  }

  removeCards( cards: Card[] ) {
    for ( const card of cards ) {
      // FIXME: this one too
      if ( this.cards.find( c => c.equals( card ) ) !== undefined )
        this.cards.remove( card );
    }
  }
}
