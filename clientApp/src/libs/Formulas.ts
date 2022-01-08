import { Card } from '../game/Card';
import { Rank, Suit } from '../game/types';

export const clone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export default class Ellipse {
  private readonly a: number = 0;
  private readonly b: number = 0;

  constructor(width: number, height: number) {
    this.a = width / 2;
    this.b = height / 2;
  }

  y(x: number): [number, number] {
    const value = (this.b * Math.sqrt(this.a ** 2 - x ** 2)) / this.a;
    return [-value, value];
  }
}

export const ellipseRanges = (width: number, skips = 4) => {
  const list = [];
  for (let i = (-1 * width) / 2; i < width / 2; i += skips) {
    list.push(i);
  }

  return list;
};

export const ellipseFirstRange = (width: number) => {
  return [(-1 * width) / 2, width / 2];
};

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const Pythagoras = (a: number, b: number) => {
  return Math.sqrt(a ** 2 + b ** 2);
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const isInRange = ([min, max]: [number, number], target: number): boolean => {
  return target >= min && target <= max;
};

export class CardCombination {
  private allCombinations: number[][] = [];
  private readonly playerCard: Card;
  private readonly tableCards: Card[];

  constructor(playerCard: Card, tableCards: Card[]) {
    this.tableCards = tableCards;
    this.playerCard = playerCard;
  }

  public get result(): number[][] {
    return this.allCombinations;
  }

  public calculate() {
    this.resetCombinations();
    switch (this.playerCard.rank) {
      case Rank.JACK:
        return this.calculateForJack();
      case Rank.QUEEN:
        return this.calculateForQueenOrKing(Rank.QUEEN);
      case Rank.KING:
        return this.calculateForQueenOrKing(Rank.KING);
      default:
        return this.calculateRecursively(0, this.playerCard.toValue(), []);
    }
  }

  private calculateRecursively(currentIndex: number, sum: number, combination: number[]) {
    if (sum === 11) {
      this.allCombinations.push([...combination]);

      return combination;
    }

    for (const v = { i: currentIndex }; v.i < this.tableCards.length; v.i++) {
      const currentCardValue = this.tableCards[v.i].toValue();
      const currentSum = sum + currentCardValue;
      if (currentSum > 11) continue;
      combination.push(v.i);
      this.calculateRecursively(v.i + 1, currentSum, combination);

      combination.splice(combination.length - 1, 1);
    }

    return this.allCombinations;
  }

  private resetCombinations() {
    this.allCombinations = [];
  }

  private calculateForJack() {
    const tableCards = clone<Card[]>(this.tableCards);
    const counter = { ofQueen: 0, ofKing: 0 };
    const excludedCardIndexes: number[] = [];
    for (const card of this.tableCards) {
      if (card.rank === Rank.QUEEN) counter.ofQueen++;
      if (card.rank === Rank.KING) counter.ofKing++;
    }

    // Below remove odd amount of extra King or Queen cards
    // Everything else can be taken by Jack
    // Queens and Kings are removed from the beginning of the array not from the end
    // It only matters in test cases just to bare in mind
    // Clubs have priority over Spades, Diamonds and Hearts so it will be removed at last

    while (counter.ofQueen % 2 !== 0) {
      const indexToRemove = tableCards.findIndex((card) => {
        if (counter.ofQueen > 1) {
          // When there are several choices remove the one with is not Clubs
          return card.rank === Rank.QUEEN && card.suit !== Suit.CLUBS;
        }
        return card.rank === Rank.QUEEN;
      });
      excludedCardIndexes.push(indexToRemove);
      counter.ofQueen--;
    }

    while (counter.ofKing % 2 !== 0) {
      const indexToRemove = tableCards.findIndex((card) => {
        if (counter.ofKing > 1) {
          // When there are several choices remove the one with is not Clubs
          return card.rank === Rank.KING && card.suit !== Suit.CLUBS;
        }
        return card.rank === Rank.KING;
      });
      excludedCardIndexes.push(indexToRemove);
      counter.ofKing--;
    }

    const combinations: number[] = [];
    tableCards.forEach((_, index) => {
      if (!excludedCardIndexes.includes(index)) combinations.push(index);
    });

    this.allCombinations = combinations.length ? [combinations] : [];

    return this.allCombinations;
  }

  private calculateForQueenOrKing(rank: Rank) {
    const combinations: number[][] = [];
    this.tableCards.forEach((_, index) => {
      if (this.tableCards[index].rank === rank) combinations.push([index]);
    });

    this.allCombinations = combinations;

    return this.allCombinations;
  }
}
