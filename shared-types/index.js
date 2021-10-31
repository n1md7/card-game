"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.Token = exports.CARD_SUM_VALUE = exports.cardSuitsByName = exports.cardRanksByName = exports.ActionType = exports.CardSuit = exports.CardRankName = exports.CardRank = void 0;
var CardRank;
(function (CardRank) {
    CardRank[CardRank["ACE"] = 1] = "ACE";
    CardRank[CardRank["TWO"] = 2] = "TWO";
    CardRank[CardRank["THREE"] = 3] = "THREE";
    CardRank[CardRank["FOUR"] = 4] = "FOUR";
    CardRank[CardRank["FIVE"] = 5] = "FIVE";
    CardRank[CardRank["SIX"] = 6] = "SIX";
    CardRank[CardRank["SEVEN"] = 7] = "SEVEN";
    CardRank[CardRank["EIGHT"] = 8] = "EIGHT";
    CardRank[CardRank["NINE"] = 9] = "NINE";
    CardRank[CardRank["TEN"] = 10] = "TEN";
    CardRank[CardRank["JACK"] = 12] = "JACK";
    CardRank[CardRank["QUEEN"] = 13] = "QUEEN";
    CardRank[CardRank["KING"] = 14] = "KING";
})(CardRank = exports.CardRank || (exports.CardRank = {}));
var CardRankName;
(function (CardRankName) {
    CardRankName["ACE"] = "ace";
    CardRankName[CardRankName["TWO"] = 2] = "TWO";
    CardRankName[CardRankName["THREE"] = 3] = "THREE";
    CardRankName[CardRankName["FOUR"] = 4] = "FOUR";
    CardRankName[CardRankName["FIVE"] = 5] = "FIVE";
    CardRankName[CardRankName["SIX"] = 6] = "SIX";
    CardRankName[CardRankName["SEVEN"] = 7] = "SEVEN";
    CardRankName[CardRankName["EIGHT"] = 8] = "EIGHT";
    CardRankName[CardRankName["NINE"] = 9] = "NINE";
    CardRankName[CardRankName["TEN"] = 10] = "TEN";
    CardRankName["JACK"] = "jack";
    CardRankName["QUEEN"] = "queen";
    CardRankName["KING"] = "king";
})(CardRankName = exports.CardRankName || (exports.CardRankName = {}));
var CardSuit;
(function (CardSuit) {
    CardSuit["CLUBS"] = "clubs";
    CardSuit["DIAMONDS"] = "diamonds";
    CardSuit["HEARTS"] = "hearts";
    CardSuit["SPADES"] = "spades";
})(CardSuit = exports.CardSuit || (exports.CardSuit = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["PLACE_CARD"] = 0] = "PLACE_CARD";
    ActionType[ActionType["TAKE_CARDS"] = 1] = "TAKE_CARDS";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
exports.cardRanksByName = new Map([
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
exports.cardSuitsByName = new Map([
    [CardSuit.CLUBS, CardSuit.CLUBS],
    [CardSuit.DIAMONDS, CardSuit.DIAMONDS],
    [CardSuit.HEARTS, CardSuit.HEARTS],
    [CardSuit.SPADES, CardSuit.SPADES],
]);
exports.CARD_SUM_VALUE = 11;
var Token;
(function (Token) {
    Token["self"] = "token";
    Token["auth"] = "authorization";
    Token["userId"] = "userId";
    Token["name"] = "name";
})(Token = exports.Token || (exports.Token = {}));
var Room;
(function (Room) {
    Room[Room["two"] = 2] = "two";
    Room[Room["three"] = 3] = "three";
    Room[Room["four"] = 4] = "four";
})(Room = exports.Room || (exports.Room = {}));
