import Card from './Card';
import { ActionType } from 'shared-types';
import { gameStore } from '../store';
import { PLAYER_MOVER_INTERVAL } from '../constant/gameConfig';
import { PlayerResult } from './PlayerResult';
import { getRandomInt } from '../helpers';
import GameException from '../exceptions/GameException';
import { PlayerCardsRespType, PlayerDataType, PlayerPositionType } from './types';

export default class Player {
  public position: PlayerPositionType;
  public score: number;
  public socketId: string;
  public readonly name: string;
  private playerResult: PlayerResult;
  private readonly playerId: string;
  private playerCardsInHand: Card[] = [];
  private playerScoredCards: Card[] = [];
  private playerGameId: string = null;

  constructor(playerId: string, name = '') {
    this.name = name;
    this.playerId = playerId;
    this.score = 0;
  }

  set gameId(gameId: string) {
    this.playerGameId = gameId;
  }

  get gameId(): string {
    return this.playerGameId;
  }

  get scoredCards() {
    return this.playerScoredCards;
  }

  get game() {
    return gameStore.getById(this.playerGameId);
  }

  get data(): PlayerDataType {
    const progressValue =
      this.game && this.game.activePlayer && this.game.activePlayer.equals(this)
        ? (100 * this.game.playerTime) / PLAYER_MOVER_INTERVAL
        : 0;

    return {
      taken: true,
      name: this.name,
      time: this.game.playerTime,
      cards: this.playerCardsInHand.length,
      isActive: this.game && this.game.activePlayer && this.game.activePlayer.equals(this),
    };
  }

  get handCards(): PlayerCardsRespType[] {
    return this.playerCardsInHand.reduce(
      (acc, card: Card) => [
        ...acc,
        {
          rank: card.name,
          suit: card.suit,
        },
      ],
      [] as PlayerCardsRespType[],
    );
  }

  get id() {
    return this.playerId;
  }

  get result() {
    return this.playerResult;
  }

  get cardsInHand() {
    return this.playerCardsInHand;
  }

  get not() {
    return {
      equals: (player: Player) => !this.equals(player),
    };
  }

  takeCardsInHand(cards: Card[]) {
    this.playerCardsInHand = [...this.playerCardsInHand, ...cards];
  }

  equals(player: Player) {
    return this.playerId === player.id;
  }

  scoreCards(cards: Card[]) {
    this.playerScoredCards = [...this.playerScoredCards, ...cards];
  }

  removeCardFromHand(cardFromHand: Card) {
    const index = this.playerCardsInHand.findIndex((card) => card.equals(cardFromHand));
    if (-1 === index) {
      console.log({ playerCardsInHand: this.playerCardsInHand, cardFromHand });
      throw new GameException('You are not holding such card in hand. Thus, it cannot be removed.');
    }
    this.playerCardsInHand.splice(index, 1);
  }

  getRandomCardFromHand() {
    if (this.playerCardsInHand.length > 0) {
      return this.playerCardsInHand[getRandomInt(this.playerCardsInHand.length - 1)];
    }
  }

  placeCardFromHand(cardFromHand: Card) {
    if (!this.playerCardsInHand.find((card) => card.equals(cardFromHand))) {
      console.log({ playerCardsInHand: this.playerCardsInHand, cardFromHand });
      throw new GameException('You are not holding such card in hand. Thus, it cannot be placed.');
    }

    this.game.playerAction(this, ActionType.PLACE_CARD, cardFromHand, []);
  }

  /**
   * @description - Executes the logic whether or not the player can make a specific move to take cardsInHand
   * @param cardFromHand - A Card that player is holding and placing on the table to create a combination and score
   * @param tableCardsToTake - Only those cardsInHand that makes combination with the cardFromHand. When taking only one card should be one element list
   */
  takeCardsFromTable(cardFromHand: Card, tableCardsToTake: Card[]) {
    if (!this.playerCardsInHand.find((card) => card.equals(cardFromHand))) {
      console.log({
        message: 'You are not holding such card in hand. Thus, it cannot be taken.',
        player: this,
        cardFromHand,
        tableCardsToTake,
      });
      throw new GameException('You are not holding such card in hand. Thus, it cannot be placed.');
    }
    this.game.playerAction(this, ActionType.TAKE_CARDS, cardFromHand, tableCardsToTake);
  }

  calculateResult() {
    this.playerResult = new PlayerResult(this.playerScoredCards);
  }

  scoreReset() {
    this.score = 0;
    this.playerResult = null;
    this.playerCardsInHand = [];
    this.playerScoredCards = [];
  }
}
