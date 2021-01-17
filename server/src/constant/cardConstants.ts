enum CardRank {
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

const cardRanksByName: Map<string, CardRank> = new Map( [
  [ "ace", CardRank.ACE ],
  [ "2", CardRank.TWO ],
  [ "3", CardRank.THREE ],
  [ "4", CardRank.FOUR ],
  [ "5", CardRank.FIVE ],
  [ "6", CardRank.SIX ],
  [ "7", CardRank.SEVEN ],
  [ "8", CardRank.EIGHT ],
  [ "9", CardRank.NINE ],
  [ "10", CardRank.TEN ],
  [ "jack", CardRank.JACK ],
  [ "queen", CardRank.QUEEN ],
  [ "king", CardRank.KING ]
] );


const cardSuitsByName: Map<string, CardSuit> = new Map( [
  [ "clubs", CardSuit.CLUBS ],
  [ "diamonds", CardSuit.DIAMONDS ],
  [ "hearts", CardSuit.HEARTS ],
  [ "spades", CardSuit.SPADES ],
] );

export const CARD_SUM_VALUE = 11;

export { CardRank, cardRanksByName, cardSuitsByName, ActionType, CardSuit }
