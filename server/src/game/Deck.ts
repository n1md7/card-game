import Card from './Card';
import { cardRanksByName, cardSuitsByName } from 'shared-types';
import { getRandomInt } from '../helpers';

export default class Deck {
  private readonly cards: Card[];

  constructor() {
    this.cards = [];
    cardSuitsByName.forEach((suitType, suitName) => {
      cardRanksByName.forEach((cardType, name) => {
        this.cards.push(new Card(suitType, name, cardType));
      });
    });
    this.shuffle();
  }

  get size(): number {
    return this.cards.length;
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  distributeCards(count: number): Card[] {
    if (this.cards.length < count) {
      throw new Error('Not enough cards in deck!');
    }

    return this.cards.splice(0, count);
  }

  private shuffle(): void {
    const N = this.cards.length;
    for (let i = 0; i < N; i++) {
      const r = i + getRandomInt(N - i);
      const temp = this.cards[i];
      this.cards[i] = this.cards[r];
      this.cards[r] = temp;
    }
  }
}
