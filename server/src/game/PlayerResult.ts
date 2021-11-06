import Card from './Card';
import { CardRank, cardRanksByName, CardSuit } from 'shared-types';

export class PlayerResult {
  public readonly numberOfClubs: number;
  public readonly numberOfCards: number;
  public readonly hasTwoOfClubs: boolean;
  public readonly hasTenOfDiamonds: boolean;
  public score: number;

  constructor(cards: Card[]) {
    this.numberOfCards = cards.length;
    this.numberOfClubs = cards.filter((card) => card.suit === CardSuit.CLUBS).length;
    this.hasTwoOfClubs =
      cards.findIndex((card) => card.suit === CardSuit.CLUBS && cardRanksByName.get(card.name) === CardRank.TWO) >= 0;
    this.hasTenOfDiamonds =
      cards.findIndex((card) => card.suit === CardSuit.DIAMONDS && cardRanksByName.get(card.name) === CardRank.TEN) >=
      0;
  }
}
