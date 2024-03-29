export declare enum CardRank {
    ACE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    JACK = 12,
    QUEEN = 13,
    KING = 14,
    NONE = 15
}
export declare enum CardRankName {
    ACE = "ace",
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    JACK = "jack",
    QUEEN = "queen",
    KING = "king",
    NONE = "none"
}
export declare enum CardSuit {
    CLUBS = "clubs",
    DIAMONDS = "diamonds",
    HEARTS = "hearts",
    SPADES = "spades",
    NONE = "none"
}
export declare enum ActionType {
    PLACE_CARD = 0,
    TAKE_CARDS = 1
}
export declare const cardRanksByName: Map<CardRankName, CardRank>;
export declare const cardSuitsByName: Map<CardSuit, CardSuit>;
export declare const CARD_SUM_VALUE = 11;
export declare enum Token {
    self = "token",
    auth = "authorization",
    userId = "userId",
    name = "name"
}
export declare enum Room {
    two = 2,
    three = 3,
    four = 4
}
export declare type GameEvents = 'one-game-finished' | 'full-game-finished' | 'add-card-on-table' | 'add-card-on-hand' | 'take-card-from-table' | 'all-players-info' | 'game:take-cards' | 'player:turn' | 'game:players-data' | 'game:finish-deck' | 'player-cards' | 'table-cards:add' | 'table-cards:remove' | 'game:start' | 'game:pending' | 'game:results' | 'game:round-results' | 'game:finish';
