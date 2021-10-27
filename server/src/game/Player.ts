import { Card } from './Card';
import { ActionType, CardRankName, CardSuit } from '../constant/cardConstants';
import { gameStore } from '../store';
import { PLAYER_MOVER_INTERVAL } from '../constant/gameConfig';
import { PlayerResult } from './PlayerResult';
import { getRandomInt } from '../helpers/extras';

export default class Player {
  public cards: Card[];
  public playerGameId: string = null;
  public position: string;
  public result: PlayerResult;
  public score: number;
  private readonly name: string;
  private readonly playerId: string;
  private takenCards: Card[];

  constructor(playerId: string, name = '') {
    this.name = name;
    this.playerId = playerId;
    this.cards = [];
    this.takenCards = [];
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
      cards: this.cards.length,
      score: this.score,
    };
  }

  get handCards() {
    return this.cards.reduce<
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

  get game() {
    return gameStore.getById(this.playerGameId);
  }

  set gameId(gameId: string) {
    this.playerGameId = gameId;
  }

  get id() {
    return this.playerId;
  }

  giveCards(cards: Card[]) {
    this.cards = [...this.cards, ...cards];
  }

  equals(player: Player) {
    return this.name === player.name;
  }

  takeCards(cards: Card[]) {
    this.takenCards = [...this.takenCards, ...cards];
  }

  removeCardFromHand(card: Card) {
    const handCard = this.cards.find((c) => c.equals(card));
    if (!handCard) this.cards.remove(handCard);
  }

  placeRandomCard() {
    this.placeCard(this.cards[getRandomInt(this.cards.length - 1)]);
  }

  placeCard(card: Card) {
    if (this.cards.find((c) => c.equals(card)) === undefined) throw Error('incorrect card');
    this.game.playerAction(this, ActionType.PLACE_CARD, card, []);
  }

  takeCardsFromTable(card: Card, tableCards: Card[]) {
    if (this.cards.find((c) => c.equals(card)) === undefined) throw Error('incorrect card');
    if (tableCards.length === 0) throw Error('Ups error WTF?');
    console.dir(card);
    console.dir(tableCards);
    this.game.playerAction(this, ActionType.TAKE_CARDS, card, tableCards);
  }

  calculateResult() {
    this.result = new PlayerResult(this.takenCards);
  }
}
