import Deck from './Deck';
import Player from './Player';
import { ActionType } from 'shared-types';
import { Card } from './Card';
import { PLAYER_MOVER_INTERVAL } from '../constant/gameConfig';
import { SocketManager } from '../socket/manager';

const positions: { [key: string]: number } = {
  down: 0,
  left: 1,
  up: 2,
  right: 3,
};

const positionsArray = ['down', 'left', 'up', 'right'];

export default class Game {
  public isStarted: boolean;
  public isFinished: boolean;
  public activePlayer: Player;
  public timeToMove: number;
  private deck: Deck;
  private timer: any;
  private currentPlayerIndex: number;
  private cards: Card[];
  private creatorId: string;
  private lastTaker: Player;
  private maxScores: number;
  private readonly players: Player[];
  private readonly gameId: string;
  private readonly numberOfPlayers: number;
  private readonly creatorName: string;
  private readonly isPublic: boolean;
  private readonly socketManager: SocketManager;

  constructor(
    numberOfPlayers: number,
    gameId: string,
    isPublic: boolean,
    userId: string,
    name: string,
    socketManager: SocketManager,
    maxScores = 11,
  ) {
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
    this.maxScores = maxScores;
    this.socketManager = socketManager;
  }

  findEmptyPositions(): any {
    const occupiedPositions = this.occupiedPositions();
    return positionsArray.filter((item) => !occupiedPositions.includes(item));
  }

  startGame(): void {
    this.isStarted = true;
    this.dealCards(true);
    this.activePlayer = this.players[this.currentPlayerIndex];
    this.startTimer();
  }

  getCardsList(): any {
    return this.cards.reduce(
      (cards, card: Card) => [
        ...cards,
        {
          rank: card.name,
          suit: card.suit,
          key: card.suit + card.name,
        },
      ],
      [],
    );
  }

  dealCards(firstDeal = false): void | null {
    if (this.deck.isEmpty()) {
      return;
    }

    for (const player of this.players) {
      const numberOfCards = 4 - player.cards.length;
      if (numberOfCards > 0) {
        player.takeCardsInHand(this.deck.distributeCards(numberOfCards));
      }
    }
    if (firstDeal) {
      this.cards = this.deck.distributeCards(4);
    }
  }

  getGameData(requestPlayer: Player): {
    playerData: {
      [x: string]: {
        taken: boolean;
        name: string;
        progress: number;
        cards: number;
        score?: number;
      };
    };
    remainedCards: number;
  } {
    type ReducePlayers = {
      [x: string]: string;
    };
    const playerData = this.players.reduce(
      (players: ReducePlayers, player: Player) => ({
        ...players,
        [player.position]: player.data,
      }),
      {},
    );

    for (const position of this.findEmptyPositions()) {
      playerData[position] = {
        taken: false,
        name: '',
        progress: 0,
        cards: 0,
        score: 0,
      };
    }

    const positionShift = positions[requestPlayer.position];
    const result: { [key: string]: any } = {};
    for (const key of Object.keys(playerData)) {
      let newIndex = positions[key] - positionShift;
      newIndex = newIndex >= 0 ? newIndex : 4 + newIndex;
      result[positionsArray[newIndex]] = playerData[key];
    }

    return {
      playerData: result,
      remainedCards: this.deck.size,
    };
  }

  playersHaveCard(): boolean {
    return this.players.some((p) => p.cards.length > 0);
  }

  changePlayer(): void {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= this.players.length) {
      this.currentPlayerIndex = 0;
      if (!this.playersHaveCard()) {
        if (this.deck.isEmpty()) {
          this.finishDeck();
        } else {
          this.dealCards();
        }
      }
    }
    this.activePlayer = this.players[this.currentPlayerIndex];
    this.timeToMove = PLAYER_MOVER_INTERVAL;
  }

  finishDeck(): void {
    this.playerAction(this.lastTaker, ActionType.TAKE_CARDS, null, this.cards, true);
    let maxCards = 0;
    let maxClubs = 0;
    this.players.forEach((player) => {
      player.calculateResult();
      if (player.result.numberOfCards > maxCards) {
        maxCards = player.result.numberOfCards;
      }
      if (player.result.numberOfClubs > maxClubs) {
        maxClubs = player.result.numberOfClubs;
      }
    });
    const clubWinners = this.players.filter((pl) => pl.result.numberOfClubs === maxClubs);
    const cardWinners = this.players.filter((pl) => pl.result.numberOfCards === maxCards);
    this.players.forEach((player) => {
      if (clubWinners.find((pl) => pl.equals(player)) != null) {
        player.score += 1;
      }
      if (cardWinners.find((pl) => pl.equals(player)) != null) {
        player.score += cardWinners.length > 1 ? 1 : 2;
      }
      if (player.result.hasTenOfDiamonds) player.score++;
      if (player.result.hasTwoOfClubs) player.score++;
      player.result.score = player.score;
    });
    this.players.forEach((player) => this.socketManager.sendMessage(player, 'game:finish-deck', player.result));
    const winnerScores = this.players
      .filter((pl) => pl.score >= this.maxScores)
      .reduce((scores, pl: Player) => [...scores, pl.score], [])
      .sort();
    if (winnerScores.length > 0) {
      const winnerScore = winnerScores[winnerScores.length - 1];
      const winnerPlayers = this.players.filter((pl) => pl.score === winnerScore);
      if (winnerPlayers.length === 1) {
        this.finishGame(winnerPlayers[0]);
        return void 0;
      }
    }
    this.restartGame();
  }

  restartGame(): void {
    this.deck = new Deck();
    this.dealCards(true);
  }

  finishGame(winnerPlayer: Player): void {
    clearInterval(this.timer);
    this.isFinished = true;
    this.players.forEach((player) => this.socketManager.sendMessage(player, 'game:finish', player.result));
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeToMove--;
      if (this.timeToMove <= 0) {
        this.activePlayer.placeRandomCardFromHand();
      }
    }, 1000);
  }

  joinPlayer(player: Player, position: string = null): void {
    if (position === null) {
      const emptyPositions = this.findEmptyPositions();
      if (emptyPositions.length > 0) {
        position = emptyPositions[0];
      }
    }

    const positionIsInvalid = !['left', 'right', 'up', 'down'].includes(position);
    const positionsAreOccupied = this.occupiedPositions().includes(position);

    if (positionIsInvalid || positionsAreOccupied) {
      throw new Error('incorrect position');
    }

    if (this.players.length >= this.numberOfPlayers) {
      throw new Error('Game is full');
    }

    player.position = position;
    player.gameId = this.getGameId();
    this.players.push(player);
    if (this.players.length === this.numberOfPlayers) {
      this.startGame();
    }
  }

  getGameDetails(): {
    id: string;
    inRoomSize: number;
    size: number;
    creator: {
      name: string;
    };
    isPublic: boolean;
  } {
    return {
      id: this.getGameId(),
      inRoomSize: this.players.length,
      size: this.numberOfPlayers,
      creator: {
        name: this.creatorName,
      },
      isPublic: this.isPublic,
    };
  }

  playerAlreadyInGameRoom(playerId: string): boolean {
    return this.players.findIndex((player) => player.id === playerId) !== -1;
  }

  getGameId(): string {
    return this.gameId;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  removePlayerFromTheGame(playerId: string): void {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index) {
      // remove from the array
      this.players.splice(index, 1);
    }
  }

  removeCardsFromTable(cards: Card[]): void {
    for (const card of cards) {
      const tableCardIndex = this.cards.findIndex((c) => c.equals(card));
      if (tableCardIndex >= 0) {
        this.cards.splice(tableCardIndex, 1);
      }
    }
  }

  tableContainsCards(cards: Card[]): boolean {
    for (const card of cards) {
      if (this.cards.find((c) => c.equals(card)) === undefined) {
        return false;
      }
    }
    return true;
  }

  playerAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[], forceMove = false): void {
    if (!forceMove) {
      this.validateAction(player, type, playerCard, tableCards);
    }
    if (type === ActionType.TAKE_CARDS) {
      if (forceMove) {
        console.dir('last move!');
        console.dir(tableCards);
      }
      this.removeCardsFromTable(tableCards);
      if (playerCard != null) {
        player.scoreCards([...tableCards, playerCard]);
        player.removeCardFromHand(playerCard);
      } else {
        player.scoreCards(tableCards);
      }
      this.lastTaker = player;
    } else if (type === ActionType.PLACE_CARD) {
      this.cards.push(playerCard);
      player.removeCardFromHand(playerCard);
    }
    if (forceMove) {
      console.dir('last moved!');
      console.dir(this.cards);
    }
    this.players.forEach((pl) => {
      const positionShift = positions[pl.position];
      let movePlayerPositionIndex = positions[player.position] - positionShift;
      movePlayerPositionIndex = movePlayerPositionIndex >= 0 ? movePlayerPositionIndex : 4 + movePlayerPositionIndex;
      this.socketManager.sendMessage(pl, 'game:take-cards', {
        position: positionsArray[movePlayerPositionIndex],
        playerCard,
        tableCards,
      });
    });
    this.changePlayer();
  }

  validateAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[]): void {
    if (!player.equals(this.activePlayer)) throw Error('incorrect player');
    if (type === ActionType.TAKE_CARDS && (!tableCards.length || !this.tableContainsCards(tableCards)))
      throw Error('incorrect cards');
    if (type === ActionType.TAKE_CARDS && !playerCard.canTakeCards(tableCards)) throw Error('incorrect move');
  }

  public statistics(): {
    message: string;
  } {
    return { message: 'Game finished!' };
  }

  private occupiedPositions() {
    return this.players.reduce((op, { position }: Player) => [...op, position], []);
  }
}
