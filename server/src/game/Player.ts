import { Card } from './Card';
import { ActionType, CardRankName, CardSuit } from 'shared-types';
import { gameStore } from '../store';
import { PLAYER_MOVER_INTERVAL } from '../constant/gameConfig';
import { PlayerResult } from './PlayerResult';
import { getRandomInt } from '../helpers/extras';

export default class Player {
  public position: string;
  public score: number;
  private playerResult: PlayerResult;
  private readonly name: string;
  private readonly playerId: string;
  private playerCardsInHand: Card[] = [];
  private playerScoredCards: Card[] = [];
  private playerGameId: string = null;

  constructor(playerId: string, name = '') {
    this.name = name;
    this.playerId = playerId;
  }

  set gameId(gameId: string) {
    this.playerGameId = gameId;
  }

  get game() {
    return gameStore.getById(this.playerGameId);
  }

  get data() {
    const progressValue =
      this.game && this.game.activePlayer && this.game.activePlayer.equals(this)
        ? (100 * this.game.timeToMove) / PLAYER_MOVER_INTERVAL
        : 0;

    return {
      taken: true,
      name: this.name,
      progress: progressValue,
      cards: this.playerCardsInHand.length,
      score: this.score,
    };
  }

  get handCards() {
    return this.playerCardsInHand.reduce<
      {
        rank: CardRankName;
        suit: CardSuit;
      }[]
    >(
      (acc, card: Card) => [
        ...acc,
        {
          rank: card.name,
          suit: card.suit,
        },
      ],
      [],
    );
  }

  get id() {
    return this.playerId;
  }

  get result() {
    return this.playerResult;
  }

  get cards() {
    return this.playerCardsInHand;
  }

  playerTakesCardsInHand(cards: Card[]) {
    this.playerCardsInHand = [...this.playerCardsInHand, ...cards];
  }

  equals(player: Player) {
    return this.playerId === player.id;
  }

  scoreCards(cards: Card[]) {
    this.playerScoredCards = [...this.playerScoredCards, ...cards];
  }

  removeCardFromHand(cardFromHand: Card) {
    if (!this.playerCardsInHand.find((card) => card.equals(cardFromHand))) {
      throw new Error('You are not holding such card in hand. Thus, it cannot be removed.');
    }
    this.playerCardsInHand.remove(cardFromHand);
  }

  placeRandomCardFromHand() {
    this.placeCardFromHand(this.playerCardsInHand[getRandomInt(this.playerCardsInHand.length - 1)]);
  }

  placeCardFromHand(cardFromHand: Card) {
    if (!this.playerCardsInHand.find((card) => card.equals(cardFromHand))) {
      throw new Error('You are not holding such card in hand. Thus, it cannot be placed.');
    }

    this.game.playerAction(this, ActionType.PLACE_CARD, cardFromHand, []);
  }

  takeCardsFromTable(card: Card, tableCards: Card[]) {
    if (this.cards.find((c) => c.equals(card)) === undefined) throw Error('incorrect card');
    if (tableCards.length === 0) throw Error('Ups error WTF?');
    console.dir(card);
    console.dir(tableCards);
    this.game.playerAction(this, ActionType.TAKE_CARDS, card, tableCards);
  }

  calculateResult() {
    this.playerResult = new PlayerResult(this.playerScoredCards);
  }
}
