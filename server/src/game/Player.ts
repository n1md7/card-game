import { Card } from "./Card";
import { ActionType } from "../constant/cardConstants";
import { id } from "../helpers/ids";
import Game from "./Game";
import { random } from "../../../game/src/libs/Formulas";
import gameController from "../controller/GameController";
import { gameStore } from "../store";

function getRandomInt( max: number ) {
  return Math.floor( Math.random() * Math.floor( max ) );
}

class Player {
  player(): Player {
    throw new Error( "Method not implemented." );
  }

  private readonly name: string;
  public cards: Card[];
  private takenCards: Card[];
  public gameId: string = null;
  public playerId: string;
  public position: string;

  constructor( playerId: string, name = '' ) {
    this.name = name;
    this.playerId = playerId;
    this.cards = [];
    this.takenCards = [];
  }

  getPlayerData() {
    const progress = (
      this.getGame() &&
      this.getGame().activePlayer &&
      !this.getGame().activePlayer.equals( this )
    ) ? 100 * this.getGame().timeToMove / 10 : 0;

    return {
      taken: true,
      name: this.name,
      progress,
      cards: this.cards.length
    }
  }

  getHandCards() {
    return this.cards
      .reduce( ( acc: any, card: Card ) => [
        ...acc, {
          rank: card.name,
          suit: card.suit
        }
      ], [] );
  }

  giveCards( cards: Card[] ) {
    this.cards = [ ...this.cards, ...cards ];
  }

  setGame( game: Game ) {
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

  equals( player: Player ) {
    // TODO change equality check
    return this.name === player.name;
  }

  takeCards( cards: Card[] ) {
    this.takenCards = [ ...this.takenCards, ...cards ];
  }

  removeCardFromHand( card: Card ) {
    const handCard = this.cards.find( c => c.equals( card ) );
    if (handCard  !== undefined )
      this.cards.remove( handCard );
  }


  placeRandomCard() {
    this.placeCard( this.cards[ getRandomInt( this.cards.length - 1 ) ] );
  }

  placeCard( card: Card ) {
    if ( this.cards.find( c => c.equals( card ) ) === undefined )
      throw Error( "incorrect card" );
    this.getGame().playerAction( this, ActionType.PLACE_CARD, card, [] );
  }

  takeCardsFromTable( card: Card, tableCards: Card[] ) {
    if ( this.cards.find( c => c.equals( card ) ) === undefined )
      throw Error( "incorrect card" );
    if ( tableCards.length === 0 )
      throw Error( "Ups error WTF?" );
    this.getGame().playerAction( this, ActionType.PLACE_CARD, card, [] );
  }

}

export default Player;
