export const ranks = new Map( [
  [ 0, 'ace' ],
  [ 1, '2' ],
  [ 2, '3' ],
  [ 3, '4' ],
  [ 4, '5' ],
  [ 5, '6' ],
  [ 6, '7' ],
  [ 7, '8' ],
  [ 8, '9' ],
  [ 9, '10' ],
  [ 10, 'jack' ],
  [ 11, 'queen' ],
  [ 12, 'king' ]
] );

export const suits = new Map( [
  [ 0, 'spades' ],
  [ 1, 'diamonds' ],
  [ 2, 'clubs' ],
  [ 3, 'hearts' ]
] );

export enum Rank {
  ace,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  jack,
  queen,
  king,
}

export enum Suit {
  spades,
  diamonds,
  clubs,
  hearts
}

export const fullDeck: Array<{
  id: string;
  suit: string;
  rank: string;
}> = [];
ranks.forEach( ( rank ) => {
  suits.forEach( ( suit ) => {
    fullDeck.push( {
      id: `${ rank }_of_${ suit }`,
      rank, suit
    } );
  } );
} );
