import { CARD_SUM_VALUE, CardRank, CardRankName, CardSuit } from '../constant/cardConstants';

export class Card {
  public readonly suit: CardSuit;
  public readonly name: CardRankName;
  public readonly value: CardRank;

  constructor(suit: CardSuit, name: CardRankName, value: CardRank) {
    this.suit = suit;
    this.name = name;
    this.value = value;
  }

  equals(card: Card): boolean {
    return this.suit === card?.suit && this.name === card?.name;
  }

  /**
   * @Description Only takes argument of cards which suppose to match counting rules.
   * When the card value is 2 and passed cards are 9 and 3 it will be false because 2+9+3 is not 11.
   * Thus, it only expects 9 in this case. This is not calculating possible combinations from the passed cards only
   * validates sum of the values.
   * @param {Card[]} cards
   * @returns {boolean}
   */
  canTakeCards(cards: Card[]): boolean {
    if (cards.length === 1 && cards[0].value >= 12 && cards[0].name === this.name) {
      return true;
    }

    const sumValue = cards.reduce((sum, card) => sum + card.value, 0);
    if (sumValue + this.value === CARD_SUM_VALUE) {
      return true;
    }

    if (this.value === CardRank.JACK) {
      const paintedCards = cards.filter((card) => card.value > CardRank.JACK);
      const paintedCardsSum = paintedCards.reduce(
        (accumulator, card) =>
          [CardSuit.SPADES, CardSuit.CLUBS].includes(card.suit) ? accumulator - card.value : accumulator + card.value,
        0,
      );

      return paintedCardsSum === 0;
    }

    return false;
  }
}
