import Deck from "./Deck";
import Player from "./Player";
import { ActionType, CardSuit } from "../constant/cardConstants";
import { Card } from "./Card";
import { PLAYER_MOVER_INTERVAL } from "../constant/gameConfig";

class Game {
  public isStarted: boolean;
  public isFinished: boolean;
  public activePlayer: Player;
  public timeToMove: number;
  private deck: Deck;
  private players: Player[];
  private readonly gameId: string;
  private readonly numberOfPlayers: number;
  private timer: any;
  private currentPlayerIndex: number;
  private cards: Card[];
  private isPublic: boolean;
  private creatorId: string;
  private creatorName: string;

  constructor( numberOfPlayers: number, gameId: string, isPublic: boolean, userId: string, name: string ) {
    this.numberOfPlayers = numberOfPlayers;
    this.deck = new Deck();
    this.gameId = gameId;
    this.players = [];
    this.isStarted = false;
    this.timeToMove = PLAYER_MOVER_INTERVAL;
    this.cards = [];
    this.currentPlayerIndex = 0;
    this.creatorId = userId;
    this.creatorName = name;
    this.isPublic = isPublic;
  }

  findEmptyPositions() {
    const positions = [ "left", "right", "up", "down" ];
    const occupiedPositions = this.occupiedPositions();

    return positions.filter( item => !occupiedPositions.includes( item ) );
  }

  startGame() {
    this.isStarted = true;
    this.dealCards( true );
    this.activePlayer = this.players[ this.currentPlayerIndex ];
    this.startTimer();
  }

  getCardsList() {
    return this.cards
      .reduce( ( cards, card: Card ) => ( [
          ...cards,
          {
            rank: card.name,
            suit: card.suit
          } ]
      ), [] );
  }

  dealCards( firstDeal: boolean = false ) {
    if ( this.deck.isEmpty() ) {
      return;
    }

    for ( const player of this.players ) {
      const numberOfCards = 4 - player.cards.length;
      if ( numberOfCards > 0 ) {
        player.giveCards( this.deck.getCards( numberOfCards ) );
      }
    }
    if ( firstDeal ) {
      this.cards = this.deck.getCards( 4 );
    }
  }

  getPlayersData() {
    const playerData = this.players.reduce( ( players: any, player: Player ) => ( {
      ...players,
      [ player.position ]: player.getPlayerData()
    } ), {} );


    for ( const position of this.findEmptyPositions() ) {
      playerData[ position ] = {
        taken: false,
        name: "",
        progress: 0,
        cards: 0
      };
    }

    // console.debug( { playerData } );
    return playerData;
  }

  playersHaveCard() {
    return this.players.some( p => p.cards.length > 0 );
  }

  changePlayer() {
    this.currentPlayerIndex++;
    if ( this.currentPlayerIndex >= this.players.length ) {
      this.currentPlayerIndex = 0;
      if ( !this.playersHaveCard() ) {
        if (this.cards.length === 0) {
          this.finishGame();
        } else {
          this.dealCards();
        }
      }
    }
    this.activePlayer = this.players[ this.currentPlayerIndex ];
  }

  finishGame() {
    clearInterval(this.timer);
    this.isFinished = true;
    this.players.forEach(player => player.calculateResult());
  }

  startTimer() {
    this.timer = setInterval( () => {
      this.timeToMove--;
      if ( this.timeToMove <= 0 ) {
        this.activePlayer.placeRandomCard();
        this.timeToMove = PLAYER_MOVER_INTERVAL;
        this.changePlayer();
      }
    }, 1000 );
  }

  joinPlayer( player: Player, position: string = null ) {
    if ( position === null ) {
      const emptyPositions = this.findEmptyPositions();
      if ( emptyPositions.length > 0 ) {
        position = emptyPositions[ 0 ];
      }
    }

    const positionIsInvalid = ![ "left", "right", "up", "down" ].includes( position );
    const positionsAreOccupied = this.occupiedPositions().includes( position );

    if ( positionIsInvalid || positionsAreOccupied ) {
      throw new Error( "incorrect position" );
    }

    if ( this.players.length >= this.numberOfPlayers ) {
      throw new Error( "Game is full" );
    }

    player.position = position;
    player.setGame( this );
    this.players.push( player );
    if ( this.players.length === this.numberOfPlayers ) {
      this.startGame();
    }
  }

  getGameData() {
    return {
      id: this.getGameId(),
      inRoomSize: this.players.length,
      size: this.numberOfPlayers,
      creator: {
        name: this.creatorName
      }
    }
  }

  playerAlreadyInGameRoom( playerId: string ): boolean {
    return this.players.findIndex( player => player.getPlayerId() === playerId ) !== -1;
  }

  getGameId() {
    return this.gameId;
  }

  getPlayers() {
    return this.players;
  }

  removePlayerFromTheGame( playerId: string ) {
    const index = this.players.findIndex( player => player.playerId === playerId );
    if ( index ) {
      // remove from the array
      this.players.splice( index, 1 );
    }
  }

  removeCardsFromTable( cards: Card[] ) {
    for ( const card of cards ) {
      const tableCardIndex = this.cards.findIndex( c => c.equals( card ) );
      if ( tableCardIndex > -1 ) {
        this.cards.splice(tableCardIndex, 1);
      }
    }
  }

  tableContainsCards( cards: Card[] ) {
    for ( const card of cards ) {
      if ( this.cards.find( c => c.equals( card ) ) === undefined ) {
        return false;
      }
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
  }

  validateAction( player: Player, type: ActionType, playerCard: Card, tableCards: Card[] ) {
    if ( !player.equals( this.activePlayer ) )
      throw Error( "incorrect player" );
    if ( type === ActionType.TAKE_CARDS && ( tableCards.length === 0 || !this.tableContainsCards( tableCards ) ) )
      throw Error( "incorrect cards" );
    if ( type === ActionType.TAKE_CARDS && !playerCard.canTakeCards( tableCards ) )
      throw Error( "incorrect move" );
  }

  private occupiedPositions() {
    return this.players.reduce( ( op, { position }: Player ) => [ ...op, position ], [] );
  }

  public statistics() {
    return {message: "Game finished!"};
  }

}

export default Game;
