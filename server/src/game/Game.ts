import Deck from './Deck';
import Player from './Player';
import User from './User';
import Card from './Card';
import GameException from '../exceptions/GameException';
import { ActionType, CardRankName, CardSuit } from 'shared-types';
import {
  PLAYER_MOVER_INTERVAL,
  SCORE_FOR_MAX_CARDS,
  SCORE_FOR_MAX_CLUBS,
  SCORE_FOR_TEN_OF_DIAMONDS,
  SCORE_FOR_TWO_OF_CLUBS,
} from '../constant/gameConfig';
import { SocketManager } from '../socket/manager';
import { PlayerPositionType, TransformedPlayerData } from './types';
import { not } from '../helpers';
import { PlayerResult } from './PlayerResult';

export default class Game {
  public isStarted: boolean;
  public isFinished: boolean;
  public activePlayer: Player;
  public debug = false;

  /**
   * @description Game deck of cardsInHand.
   */
  private deckOfCards: Deck;

  /**
   * @description Game timer. It keeps track of the game timer when the last update happened to send the events.
   */
  private lastUpdate: number;

  /**
   * @description Current player index. It represents the active player index - whoever is making the move.
   */
  private cpi: number;

  /**
   * @description Table cardsInHand array.
   */
  private cards: Card[];

  /**
   * @description Game creator(player) identifier
   */
  private creatorId: string;

  /**
   * @description Player time to move. When player time to move is over, the game will place the random card.
   */
  private timeToMove: number;

  /**
   * @description Player whoever scored card the last time
   */
  private lastCardTaker: Player;

  private readonly maxScores: number; // This should be configurable
  private readonly maxRounds: number; // This should be configurable
  private readonly dealCardsAmount: number = 4;
  private readonly gamePlayers: Player[];
  private readonly gameId: string;
  private readonly numberOfPlayers: number;
  private readonly creatorName: string;
  private readonly isPublic: boolean;

  /**
   * @description Game socket manager.
   * @private
   */
  private readonly io: SocketManager;
  private readonly positions: PlayerPositionType[];
  private roundsCounter: number;
  private gameResults: PlayerResult[];

  constructor(
    numberOfPlayers: number,
    gameId: string,
    isPublic: boolean,
    userId: string,
    name: string,
    socketManager: SocketManager,
    shuffleCards = true,
    maxScores = 5,
    maxRounds = 1,
  ) {
    this.numberOfPlayers = numberOfPlayers;
    this.deckOfCards = shuffleCards ? new Deck().shuffle() : new Deck();
    this.gameId = gameId;
    this.gamePlayers = [];
    this.isStarted = false;
    this.timeToMove = PLAYER_MOVER_INTERVAL;
    this.lastUpdate = Date.now();
    this.cards = [];
    this.cpi = 0;
    this.creatorId = userId;
    this.creatorName = name;
    this.isPublic = isPublic;
    this.io = socketManager;
    this.positions = ['down', 'left', 'up', 'right'];
    this.maxScores = maxScores;
    this.maxRounds = maxRounds;
    this.roundsCounter = 1;
  }

  get results(): PlayerResult[] {
    return this.gameResults;
  }

  get deck() {
    return this.deckOfCards;
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

  get playerTime() {
    return this.timeToMove;
  }

  get cardsOnTable() {
    return this.cards;
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

  private get occupiedPositions() {
    return this.gamePlayers.reduce((opAcc, { position }) => [...opAcc, position], [] as PlayerPositionType[]);
  }

  /**
   * @description It calculates game scores and mutates original players
   */
  public static calculateScores(players: Player[]) {
    const max = { clubs: 0, cards: 0 };
    for (const player of players) {
      player.calculateResult();
      if (player.result.numberOfClubs > max.clubs) max.clubs = player.result.numberOfClubs;
      if (player.result.numberOfCards > max.cards) max.cards = player.result.numberOfCards;
      if (player.result.hasTenOfDiamonds) player.score += SCORE_FOR_TEN_OF_DIAMONDS;
      if (player.result.hasTwoOfClubs) player.score += SCORE_FOR_TWO_OF_CLUBS;
    }

    const [clubWinner, clubsDrawn = null] = players.filter((player) => player.result.numberOfClubs === max.clubs);
    const [cardWinner, cardsDrawn = null] = players.filter((player) => player.result.numberOfCards === max.cards);
    if (null === cardsDrawn) cardWinner.score += SCORE_FOR_MAX_CARDS;
    if (null === clubsDrawn) clubWinner.score += SCORE_FOR_MAX_CLUBS;
  }

  findEmptyPositions() {
    return this.positions.filter((item) => not(this.occupiedPositions.includes(item)));
  }

  startGame(): void {
    if (this.isStarted) return;
    this.isStarted = true;
    this.dealCards(true);
    this.activePlayer = this.gamePlayers[this.cpi];
    // Mainly for testing purposes to have it the default value
    this.lastCardTaker = this.activePlayer;
  }

  dealCards(firstDeal = false): void | null {
    if (this.deckOfCards.isEmpty()) {
      return null;
    }

    for (const player of this.gamePlayers) {
      const numberOfCards = this.dealCardsAmount - player.cardsInHand.length;
      if (numberOfCards > 0) {
        player.takeCardsInHand(this.deckOfCards.distributeCards(numberOfCards));
      }
    }
    if (firstDeal) {
      this.cards = this.deckOfCards.distributeCards(this.dealCardsAmount);
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

    const result = {} as TransformedPlayerData;
    const positionShift = this.positions.indexOf(requestPlayer.position);
    for (const key in transformedPlayerData) {
      if (transformedPlayerData.hasOwnProperty(key)) {
        const newIndex = { value: this.positions.indexOf(key as PlayerPositionType) - positionShift };
        newIndex.value = newIndex.value >= 0 ? newIndex.value : 4 + newIndex.value;
        const newPosition: PlayerPositionType = this.positions[newIndex.value];
        result[newPosition] = transformedPlayerData[key as PlayerPositionType];
      }
    }

    return {
      playerData: result,
      remainedCards: this.deckOfCards.size,
    };
  }

  /**
   * @description Whether or not at least one player is holding a card
   */
  playersHaveCards(): boolean {
    return this.gamePlayers.some((player) => player.cardsInHand.length);
  }

  changePlayer(): void {
    this.cpi++;
    if (this.cpi >= this.gamePlayers.length) {
      this.cpi = 0;
      if (!this.playersHaveCards()) {
        if (this.deckOfCards.isEmpty()) {
          this.finishOneGame();
        } else {
          this.dealCards();
        }
      }
    }
    this.activePlayer = this.gamePlayers[this.cpi];
    this.timeToMove = PLAYER_MOVER_INTERVAL;
  }

  finishOneGame(): void {
    // When cards left on the table give it to last taker
    if (this.cards.length) {
      this.lastCardTaker.scoreCards(this.cards);
      this.cards = [];
    }

    Game.calculateScores(this.gamePlayers);
    const results = this.gamePlayers.map((player) => ({
      name: player.name,
      score: player.score,
      result: player.result,
    }));
    this.roundsCounter++;
    this.io.to(this.gamePlayers).emit('one-game-finished', results);
    this.evaluateEndOfGame();
  }

  evaluateEndOfGame(): void {
    const scores = this.gamePlayers.map(({ score }) => score);
    const max = Math.max(...scores);
    const winnerScore = max >= this.maxScores ? max : null;
    if (winnerScore) {
      const [winnerPlayer, noWinner = null] = this.gamePlayers.filter(({ score }) => score === winnerScore);
      if (null === noWinner) {
        this.finishGame(winnerPlayer);
        return void 0;
      }
    }
    if (this.roundsCounter >= this.maxRounds) {
      this.finishGame(null);
    }
  }

  restartGame(shuffle: true): void {
    this.deckOfCards = shuffle ? new Deck().shuffle() : new Deck();
    this.dealCards(true);
  }

  finishGame(winnerPlayer: Player): void {
    this.isFinished = true;
    this.gameResults = this.gamePlayers.map((player) => player.result);
    this.io.to(this.gamePlayers).emit('game-is-over', this.gameResults, winnerPlayer.id);
  }

  ticker(callback: (tick: boolean, delta: number) => void): void {
    const now = Date.now();
    const delta = now - this.lastUpdate;
    // Tick happens every second
    const tick = this.isStarted && delta >= 1000;
    if (tick) {
      this.lastUpdate = Date.now();
      this.timeToMove--;
    }
    callback(tick, delta);
  }

  joinPlayer(player: Player, position: PlayerPositionType | null = null): void {
    if (position === null) {
      const [emptyPosition = null] = this.findEmptyPositions();
      if (emptyPosition === null) {
        throw new GameException(`Table is full`);
      }
      position = emptyPosition;
    }

    const positionIsInvalid = !['left', 'right', 'up', 'down'].includes(position);
    const positionsAreOccupied = this.occupiedPositions.includes(position);

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

  removePlayerFromGameById(playerId: string): void {
    const index = this.gamePlayers.findIndex((player) => player.id === playerId);
    if (index > -1) {
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
    if (!cards?.length) return false;

    for (const card of cards) {
      if (!this.cards.find((c) => c.equals(card))) {
        if (this.debug) console.log(`Table does not contain card [`, card, ']');
        return false;
      }
    }

    return true;
  }

  playerAction(targetPlayer: Player, type: ActionType, playerCard: Card, tableCards: Card[]): void {
    this.validateAction(targetPlayer, type, playerCard, tableCards);

    switch (type) {
      case ActionType.TAKE_CARDS:
        this.removeCardsFromTable(tableCards);
        if (playerCard !== null) {
          targetPlayer.scoreCards([...tableCards, playerCard]);
          targetPlayer.removeCardFromHand(playerCard);
        } else {
          targetPlayer.scoreCards(tableCards);
        }
        this.lastCardTaker = targetPlayer;
        break;
      case ActionType.PLACE_CARD:
        this.cards.push(playerCard);
        targetPlayer.removeCardFromHand(playerCard);
        break;
      default:
        throw new GameException(`Invalid action type [${type}]`);
    }

    this.gamePlayers.forEach((player) => {
      const positionShift = this.positions.indexOf(player.position);
      // Move player to the next position
      const mppIndex = { value: this.positions.indexOf(targetPlayer.position) - positionShift };
      mppIndex.value = mppIndex.value >= 0 ? mppIndex.value : 4 + mppIndex.value;
      this.io.to(player).emit('game:take-cards', {
        position: this.positions[mppIndex.value],
        playerCard,
        tableCards,
      });
    });
    this.changePlayer();
  }

  validateAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[]): void {
    if (player.not.equals(this.activePlayer)) throw new GameException('Action validation problem. Incorrect player.');
    if (type === ActionType.TAKE_CARDS) {
      if (tableCards.length === 0) {
        throw new GameException('Action validation problem. TableCards length is zero.');
      }
      if (not(this.tableContainsCards(tableCards))) {
        throw new GameException(`Action validation problem. Cards do not match tableCards.`);
      }
    }
    if (type === ActionType.TAKE_CARDS && !playerCard.canTakeCards(tableCards)) {
      throw new GameException('Action validation problem. Incorrect move.');
    }
  }

  public statistics() {
    return { message: 'Game finished!' };
  }
}
