export enum CardRank {
  ACE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK = 12,
  QUEEN,
  KING,
}

export enum CardRankName {
  ACE = 'ace',
  TWO = 2,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK = 'jack',
  QUEEN = 'queen',
  KING = 'king',
}

export enum CardSuit {
  CLUBS = 'clubs',
  DIAMONDS = 'diamonds',
  HEARTS = 'hearts',
  SPADES = 'spades',
}

export enum ActionType {
  PLACE_CARD,
  TAKE_CARDS,
}

export const cardRanksByName: Map<CardRankName, CardRank> = new Map([
  [CardRankName.ACE, CardRank.ACE],
  [CardRankName.TWO, CardRank.TWO],
  [CardRankName.THREE, CardRank.THREE],
  [CardRankName.FOUR, CardRank.FOUR],
  [CardRankName.FIVE, CardRank.FIVE],
  [CardRankName.SIX, CardRank.SIX],
  [CardRankName.SEVEN, CardRank.SEVEN],
  [CardRankName.EIGHT, CardRank.EIGHT],
  [CardRankName.NINE, CardRank.NINE],
  [CardRankName.TEN, CardRank.TEN],
  [CardRankName.JACK, CardRank.JACK],
  [CardRankName.QUEEN, CardRank.QUEEN],
  [CardRankName.KING, CardRank.KING],
]);

export const cardSuitsByName: Map<CardSuit, CardSuit> = new Map([
  [CardSuit.CLUBS, CardSuit.CLUBS],
  [CardSuit.DIAMONDS, CardSuit.DIAMONDS],
  [CardSuit.HEARTS, CardSuit.HEARTS],
  [CardSuit.SPADES, CardSuit.SPADES],
]);

export const CARD_SUM_VALUE = 11;
