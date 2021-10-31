import Deck from './Deck';
import Player, { PlayerDataType, PlayerPositionType } from './Player';
import { ActionType, CardRankName, CardSuit } from 'shared-types';
import { Card } from './Card';
import { PLAYER_MOVER_INTERVAL } from '../constant/gameConfig';
import { SocketManager } from '../socket/manager';
import GameException from '../exceptions/GameException';
import User from './User';

type TransformedPlayerData = { [position in PlayerPositionType]: PlayerDataType };

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
  private readonly gamePlayers: Player[];
  private readonly gameId: string;
  private readonly numberOfPlayers: number;
  private readonly creatorName: string;
  private readonly isPublic: boolean;
  private readonly socketManager: SocketManager;
  private readonly positions: PlayerPositionType[];

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
    this.gamePlayers = [];
    this.isStarted = false;
    this.timeToMove = PLAYER_MOVER_INTERVAL;
    this.cards = [];
    this.currentPlayerIndex = 0;
    this.creatorId = userId;
    this.creatorName = name;
    this.isPublic = isPublic;
    this.maxScores = maxScores;
    this.socketManager = socketManager;
    this.positions = ['down', 'left', 'up', 'right'];
  }

  get details() {
    return {
      id: this.gameId,
      inRoomSize: this.gamePlayers.length,
      size: this.numberOfPlayers,
      creator: {
        name: this.creatorName,
      },
      isPublic: this.isPublic,
    };
  }

  get id(): string {
    return this.gameId;
  }

  get players(): Player[] {
    return this.gamePlayers;
  }

  get cardsList() {
    return this.cards.reduce(
      (cards, card) => [
        ...cards,
        {
          rank: card.name,
          suit: card.suit,
          key: card.suit + card.name,
        },
      ],
      [] as {
        rank: CardRankName;
        suit: CardSuit;
        key: string;
      }[],
    );
  }

  findEmptyPositions() {
    const occupiedPositions = this.occupiedPositions();
    return this.positions.filter((item) => !occupiedPositions.includes(item));
  }

  startGame(): void {
    this.isStarted = true;
    this.dealCards(true);
    this.activePlayer = this.gamePlayers[this.currentPlayerIndex];
    this.startTimer();
  }

  dealCards(firstDeal = false): void | null {
    if (this.deck.isEmpty()) {
      return null;
    }

    for (const player of this.gamePlayers) {
      const numberOfCards = 4 - player.cards.length;
      if (numberOfCards > 0) {
        player.takeCardsInHand(this.deck.distributeCards(numberOfCards));
      }
    }
    if (firstDeal) {
      this.cards = this.deck.distributeCards(4);
    }
  }

  getGameData(requestPlayer: Player) {
    if (!requestPlayer.position) {
      throw new GameException('Property [position] has to be defined for the object');
    }

    const transformedPlayerData: TransformedPlayerData = this.gamePlayers.reduce(
      (transformedPlayerDataAcc, player) => ({
        ...transformedPlayerDataAcc,
        [player.position]: player.data,
      }),
      {} as TransformedPlayerData,
    );

    for (const position of this.findEmptyPositions()) {
      transformedPlayerData[position] = {
        taken: false,
        name: '',
        progress: 0,
        cards: 0,
        score: 0,
      };
    }

    type Result = { [key in PlayerPositionType]: TransformedPlayerData };
    const result: Result = {} as Result;
    const positionShift = this.positions.indexOf(requestPlayer.position);
    for (const key in transformedPlayerData) {
      // eslint-disable-next-line no-prototype-builtins
      if (transformedPlayerData.hasOwnProperty(key)) {
        const newIndex = { value: this.positions.indexOf(key as PlayerPositionType) - positionShift };
        newIndex.value = newIndex.value >= 0 ? newIndex.value : 4 + newIndex.value;
        const newPosition = this.positions[newIndex.value];
        // @ts-ignore
        result[newPosition] = transformedPlayerData[key as PlayerPositionType];
      }
    }

    return {
      playerData: result,
      remainedCards: this.deck.size,
    };
  }

  /**
   * @description Whether or not at least one player is holding a card
   */
  playersHaveCard(): boolean {
    return this.gamePlayers.some((player) => player.cards.length);
  }

  changePlayer(): void {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= this.gamePlayers.length) {
      this.currentPlayerIndex = 0;
      if (!this.playersHaveCard()) {
        if (this.deck.isEmpty()) {
          this.finishDeck();
        } else {
          this.dealCards();
        }
      }
    }
    this.activePlayer = this.gamePlayers[this.currentPlayerIndex];
    this.timeToMove = PLAYER_MOVER_INTERVAL;
  }

  finishDeck(): void {
    this.playerAction(this.lastTaker, ActionType.TAKE_CARDS, null, this.cards, true);
    let maxCards = 0;
    let maxClubs = 0;
    this.gamePlayers.forEach((player) => {
      player.calculateResult();
      if (player.result.numberOfCards > maxCards) {
        maxCards = player.result.numberOfCards;
      }
      if (player.result.numberOfClubs > maxClubs) {
        maxClubs = player.result.numberOfClubs;
      }
    });
    const clubWinners = this.gamePlayers.filter((pl) => pl.result.numberOfClubs === maxClubs);
    const cardWinners = this.gamePlayers.filter((pl) => pl.result.numberOfCards === maxCards);
    this.gamePlayers.forEach((player) => {
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
    this.gamePlayers.forEach((player) => this.socketManager.sendMessage(player, 'game:finish-deck', player.result));
    const winnerScores = this.gamePlayers
      .filter((pl) => pl.score >= this.maxScores)
      .reduce((scores, pl: Player) => [...scores, pl.score], [])
      .sort();
    if (winnerScores.length > 0) {
      const winnerScore = winnerScores[winnerScores.length - 1];
      const winnerPlayers = this.gamePlayers.filter((pl) => pl.score === winnerScore);
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
    this.gamePlayers.forEach((player) => this.socketManager.sendMessage(player, 'game:finish', player.result));
  }

  // FIXME this might be unnecessary as well. One time should be enough from global level
  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeToMove--;
      if (this.timeToMove <= 0) {
        this.activePlayer.placeRandomCardFromHand();
      }
    }, 1000);
  }

  joinPlayer(player: Player, position: PlayerPositionType | null = null): void {
    if (position === null) {
      const [emptyPosition = null] = this.findEmptyPositions();
      position = emptyPosition;
    }

    const positionIsInvalid = !['left', 'right', 'up', 'down'].includes(position);
    const positionsAreOccupied = this.occupiedPositions().includes(position);

    if (positionIsInvalid) throw new GameException(`Invalid position. Incorrect value [${position}]`);
    if (positionsAreOccupied) throw new GameException(`Position [${position}] is occupied`);

    if (this.gamePlayers.length >= this.numberOfPlayers) {
      throw new GameException('Game is full');
    }

    player.position = position;
    player.gameId = this.gameId;
    this.gamePlayers.push(player);
    if (this.gamePlayers.length === this.numberOfPlayers) {
      this.startGame();
    }
  }

  playerAlreadyInGameRoom(targetPlayer: Player | User): boolean {
    return this.gamePlayers.some((player) => player.id === targetPlayer.id);
  }

  removePlayerFromTheGame(playerId: string): void {
    const index = this.gamePlayers.findIndex((player) => player.id === playerId);
    if (index) {
      // remove from the array
      this.gamePlayers.splice(index, 1);
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
    this.gamePlayers.forEach((pl) => {
      const positionShift = this.positions.indexOf(pl.position);
      const movePlayerPositionIndex = {
        value: this.positions.indexOf(player.position) - positionShift,
      };
      movePlayerPositionIndex.value =
        movePlayerPositionIndex.value >= 0 ? movePlayerPositionIndex.value : 4 + movePlayerPositionIndex.value;
      this.socketManager.sendMessage(pl, 'game:take-cards', {
        position: this.positions[movePlayerPositionIndex.value],
        playerCard,
        tableCards,
      });
    });
    this.changePlayer();
  }

  validateAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[]): void {
    if (player.not.equals(this.activePlayer)) throw new GameException('Action validation problem. Incorrect player.');
    if (type === ActionType.TAKE_CARDS && (!tableCards.length || !this.tableContainsCards(tableCards))) {
      throw new GameException('Action validation problem. Incorrect cards.');
    }
    if (type === ActionType.TAKE_CARDS && !playerCard.canTakeCards(tableCards)) {
      throw new GameException('Action validation problem. Incorrect move.');
    }
  }

  public statistics() {
    return { message: 'Game finished!' };
  }

  private occupiedPositions() {
    return this.gamePlayers.reduce((opAcc, { position }) => [...opAcc, position], [] as PlayerPositionType[]);
  }
}
