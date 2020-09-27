import { Card } from "./card";
import { ActionType } from "./constants";
import { id } from "../helpers/ids";
import Game from "./game";
import { random } from "../../../game/src/libs/Formulas";

function getRandomInt( max: number ) {
  return Math.floor( Math.random() * Math.floor( max ) );
}

class Player {
  player(): Player {
      throw new Error("Method not implemented.");
  }
  private readonly name: string;
  public cards: Card[];
  private takenCards: Card[];
  private game: Game = null;
  private playerId: string;
  public position: string;

  constructor(name:string) {
    this.name = name;
    this.playerId = id.player()
    this.cards = [];
    this.takenCards = [];
  }

  getPlayerData() {
    return {
      taken: true,
      name: this.name,
      progress: this.game === null || [null, undefined].includes(this.game.activePlayer) || !this.game.activePlayer.equals(this) ? 0 : 100 * this.game.timeToMove / 10,
      cards: this.cards.length
    }
  }

  getHandCards() {
    return this.cards.reduce( ( a: any, card: Card ) => ( a.push({rank: card.name, suit: card.suit }) , a ), [] );
  }

  giveCards(cards: Card[]) {
    this.cards = [...this.cards, ...cards];
  }

  setGame(game: Game) {
    this.game = game;
  }

  getPlayerId() {
    return this.playerId;
  }

  getGameId() {
    return this.game?.getGameId();
  }

  equals(player: Player) {
    // TODO change equality check
    return this.name === player.name;
  }

  takeCards(cards: Card[]) {
    this.takenCards = [...this.takenCards, ...cards];
  }

  removeCardFromHand(card: Card) {
    if(this.cards.find(c => c.equals(card)) !== undefined)
      this.cards.remove(card);
  }



  placeRandomCard() {
    this.placeCard(this.cards[getRandomInt(this.cards.length - 1)]);
  }

  placeCard(card: Card) {
    if(this.cards.find(c => c.equals(card)) === undefined)
      throw Error("incorrect card");
    this.game.playerAction(this, ActionType.PLACE_CARD, card, []);
  }

  takeCardsFromTable(card: Card, tableCards: Card[]) {
    if(this.cards.find(c => c.equals(card)) === undefined)
      throw Error("incorrect card");
    if(tableCards.length === 0)
      throw Error("Ups error");
    this.game.playerAction(this, ActionType.PLACE_CARD, card, []);
  }

}


export default Player;