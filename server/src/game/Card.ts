import { CARD_SUM_VALUE, CardRank, CardRankName, CardSuit } from 'shared-types';
import { isEven } from '../helpers/extras';

export class Card {
  public readonly suit: CardSuit;
  public readonly name: CardRankName;
  public readonly value: CardRank;

  constructor(suit: CardSuit, name: CardRankName, value: CardRank) {
    this.suit = suit;
    this.name = name;
    this.value = value;
  }

  get not() {
    return {
      equals: (card: Card) => !this.equals(card),
    };
  }

  equals(card: Card): boolean {
    return card && this.suit === card.suit && this.name === card.name;
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
    if (!cards.length) return false;

    if (cards.length === 1 && cards[0].value >= 12 && cards[0].name === this.name) {
      return true;
    }

    const sumValue = cards.reduce((sum, card) => sum + card.value, 0);
    if (sumValue + this.value === CARD_SUM_VALUE) {
      return true;
    }

    if (this.value === CardRank.JACK) {
      const counter: { [key: number]: number } = {
        [CardRank.QUEEN]: 0,
        [CardRank.KING]: 0,
      };
      for (const card of cards) {
        if (card.value > CardRank.JACK) {
          counter[card.value]++;
        }
      }

      return isEven(counter[CardRank.QUEEN]) && isEven(counter[CardRank.KING]);
    }

    return false;
  }
}
