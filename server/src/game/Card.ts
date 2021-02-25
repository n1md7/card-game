import {CARD_SUM_VALUE, CardSuit, CardRank} from "../constant/cardConstants";

class Card {
  public readonly suit: CardSuit;
  public readonly name: string;
  public readonly value: number;

  constructor(suit: CardSuit, name: string, value: number) {
    this.suit = suit;
    this.name = name;
    this.value = value;
  }

  equals(card: Card): boolean {
    return this.suit === card?.suit && this.name === card?.name;
  }

  canTakeCards(cards: Card[]): boolean {
    if (cards.length === 1 && cards[0].value >= 12 && cards[0].name === this.name) {
      return true;
    }

    const sumValue = cards.reduce((acc, cv) => acc + cv.value, 0);
    if (sumValue + this.value === CARD_SUM_VALUE) {
      return true;
    }

    if (this.value === CardRank.JACK) {
      const paintedCards = cards.filter(card => card.value > CardRank.JACK);
      const paintedCardsSum = paintedCards.reduce((accumulator, card) =>
        [CardSuit.SPADES, CardSuit.CLUBS].includes(card.suit) ?
          accumulator - card.value : accumulator + card.value, 0);

      return paintedCardsSum === 0;
    }

    return false;
  }

}

export {Card};
