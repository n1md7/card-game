import {Card} from "./Card";
import {ActionType} from "../constant/cardConstants";
import Game from "./Game";
import {gameStore} from "../store";
import {PLAYER_MOVER_INTERVAL} from "../constant/gameConfig";
import {PlayerResult} from "./PlayerResult";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Player {
  player(): Player {
    throw new Error("Method not implemented.");
  }

  private readonly name: string;
  public cards: Card[];
  private takenCards: Card[];
  public gameId: string = null;
  public playerId: string;
  public position: string;
  public result: PlayerResult;
  public score: number;

  constructor(playerId: string, name = '') {
    this.name = name;
    this.playerId = playerId;
    this.cards = [];
    this.takenCards = [];
  }

  getPlayerData() {
    const progress = (
      this.getGame() &&
      this.getGame().activePlayer &&
      this.getGame().activePlayer.equals(this)
    ) ? 100 * this.getGame().timeToMove / PLAYER_MOVER_INTERVAL : 0;

    return {
      taken: true,
      name: this.name,
      progress,
      cards: this.cards.length,
      score: this.score,
    }
  }

  getHandCards() {
    return this.cards
      .reduce((acc: any, card: Card) => [
        ...acc, {
          rank: card.name,
          suit: card.suit,
        },
      ], []);
  }

  giveCards(cards: Card[]) {
    this.cards = [...this.cards, ...cards];
  }

  setGame(game: Game) {
    this.gameId = game.getGameId();
  }

  getGame() {
    return gameStore.getById(this.gameId);
  }

  getPlayerId() {
    return this.playerId;
  }

  getGameId() {
    return this.gameId;
  }

  equals(player: Player) {
    // TODO change equality check
    return this.name === player.name;
  }

  takeCards(cards: Card[]) {
    this.takenCards = [...this.takenCards, ...cards];
  }

  removeCardFromHand(card: Card) {
    const handCard = this.cards.find(c => c.equals(card));
    if (handCard !== undefined)
      this.cards.remove(handCard);
  }


  placeRandomCard() {
    this.placeCard(this.cards[getRandomInt(this.cards.length - 1)]);
  }

  placeCard(card: Card) {
    if (this.cards.find(c => c.equals(card)) === undefined)
      throw Error("incorrect card");
    this.getGame().playerAction(this, ActionType.PLACE_CARD, card, []);
  }

  takeCardsFromTable(card: Card, tableCards: Card[]) {
    if (this.cards.find(c => c.equals(card)) === undefined)
      throw Error("incorrect card");
    if (tableCards.length === 0)
      throw Error("Ups error WTF?");
    console.dir(card);
    console.dir(tableCards);
    this.getGame().playerAction(this, ActionType.TAKE_CARDS, card, tableCards);
  }

  calculateResult() {
    this.result = new PlayerResult(this.takenCards);
  }

}

export default Player;
