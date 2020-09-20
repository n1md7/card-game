import Deck from "./deck";
import Player from "./player";
import { ActionType } from "./constants";
import { Card } from "./card";
import { id } from "../helpers/ids";
import Timeout = NodeJS.Timeout;

class Game {
  public isStarted: boolean;

  private deck: Deck;
  private players: Player[];
  private activePlayer: Player;
  private gameId: string;
  private numberOfPlayers: number;
  private timeToMove: number;
  private timer: Timeout;
  private currentPlayerIndex: number;
  private cards: Card[];

  constructor( numberOfPlayers: number ) {
    this.numberOfPlayers = numberOfPlayers;
    this.deck = new Deck();
    this.gameId = id.game();
    this.players = [];
    this.isStarted = false;
    this.timeToMove = 10;
    this.cards = [];
  }

  startGame() {
    this.isStarted = true;
    this.activePlayer = this.players[ this.currentPlayerIndex ];
    this.startTimer();
  }

  dealCards() {
    for(const player of this.players) {
      player.giveCards(this.deck.getCards(6));
    }
    this.cards = this.deck.getCards(4);
  }

  changePlayer() {
    this.currentPlayerIndex++;
    if ( this.currentPlayerIndex >= this.players.length ) {
      this.currentPlayerIndex = 0;
    }
    this.activePlayer = this.players[ this.currentPlayerIndex ];
  }

  startTimer() {
    this.timer = setInterval( () => {
      if ( this.timeToMove <= 0 ) {
        this.changePlayer();
        this.timeToMove = 10;
      }
    }, 1000 );
  }

  joinPlayer( player: Player ) {
    if ( this.players.length >= this.numberOfPlayers )
      throw new Error( "Game is fool" );
    player.setGameActionCallBack( this.playerAction )
    this.players.push( player );
    if ( this.players.length === this.numberOfPlayers ) {
      this.startGame();
    }
  }

  getGameData() {
    return {
      id: this.getGameId(),
      inRoomSize: this.players.length,
      size: this.numberOfPlayers
    }
  }

  getGameId() {
    return this.gameId;
  }

  getPlayers() {
    return this.players;
  }

  removeCardsFromTable( cards: Card[] ) {
    for ( const card of cards ) {
      if ( this.cards.find( c => c.equals( card ) ) !== undefined )
        this.cards.remove( card );
    }
  }

  tableContainsCards( cards: Card[] ) {
    for ( const card of cards ) {
      if ( this.cards.find( c => c.equals( card ) ) === undefined )
        return false;
    }
    return true;
  }

  playerAction( player: Player, type: ActionType, playerCard: Card, tableCards: Card[] ) {
    this.validateAction( player, type, playerCard, tableCards );
    if ( type === ActionType.TAKE_CARDS ) {
      this.removeCardsFromTable( tableCards );
      player.takeCards( [ ...tableCards, playerCard ] );
      player.removeCardFromHand( playerCard );
    } else if ( type === ActionType.PLACE_CARD ) {
      this.cards.push( playerCard );
      player.removeCardFromHand( playerCard );
    }
    this.changePlayer();
  }

  validateAction( player: Player, type: ActionType, playerCard: Card, tableCards: Card[] ) {
    if ( !player.equals( this.activePlayer ) )
      throw Error( "incorrect player" );
    if ( type === ActionType.TAKE_CARDS && ( tableCards.length === 0 || !this.tableContainsCards( tableCards ) ) )
      throw Error( "incorrect cards" );
    if ( type === ActionType.TAKE_CARDS && !playerCard.canTakeCards( tableCards ) )
      throw Error( "incorrect move" );
  }

}

export default Game;