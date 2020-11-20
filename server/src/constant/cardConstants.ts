enum CardType {
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
  KING
}

enum CardSuit {
  CLUBS = "clubs",
  DIAMONDS = "diamonds",
  HEARTS = "hearts",
  SPADES = "spades"
}


enum ActionType {
  PLACE_CARD,
  TAKE_CARDS
}

const cardTypesByName: Map<string, CardType> = new Map( [
  [ "ace", CardType.ACE ],
  [ "2", CardType.TWO ],
  [ "3", CardType.THREE ],
  [ "4", CardType.FOUR ],
  [ "5", CardType.FIVE ],
  [ "6", CardType.SIX ],
  [ "7", CardType.SEVEN ],
  [ "8", CardType.EIGHT ],
  [ "9", CardType.NINE ],
  [ "10", CardType.TEN ],
  [ "jack", CardType.JACK ],
  [ "queen", CardType.QUEEN ],
  [ "king", CardType.KING ]
] );


const cardSuitsByName: Map<string, CardSuit> = new Map( [
  [ "clubs", CardSuit.CLUBS ],
  [ "diamonds", CardSuit.DIAMONDS ],
  [ "hearts", CardSuit.HEARTS ],
  [ "spades", CardSuit.SPADES ],
] );

export const CARD_SUM_VALUE = 11;

export { CardType, cardTypesByName, cardSuitsByName, ActionType, CardSuit }
