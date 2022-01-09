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
import { GameResult, PlayerPositionType, RoundResult, TransformedPlayerData } from './types';
import { not } from '../helpers';
import * as R from 'rambda';

export default class Game {
  public isStarted: boolean;
  public isFinished: boolean;
  public activePlayer: Player;
  public debug = false;
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
  public winner: Player;
  public finishedAt = Number.MAX_SAFE_INTEGER;
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
  private readonly positions: { [key: number]: PlayerPositionType[] };
  private roundsCounter = 1;
  private latestRoundResults: RoundResult[] = [];
  private allRoundResults: RoundResult[][] = [];
  private gameResult: GameResult[] = [];
  private isIdle: boolean;
  private idleAt: number;
  public idleTime: number;
  private dealerIndex = -1;

  constructor(
    numberOfPlayers: number,
    gameId: string,
    isPublic: boolean,
    userId: string,
    name: string,
    socketManager: SocketManager,
    shuffleCards = true,
    maxScores = 6,
    maxRounds = 3, // TODO Make this configurable
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
    this.positions = {
      [2]: ['down', 'up'],
      [3]: ['down', 'left', 'right'],
      [4]: ['down', 'left', 'up', 'right'],
    };
    this.maxScores = maxScores;
    this.maxRounds = maxRounds;
  }

  get idle() {
    return this.isIdle;
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
      createdAt: this.createdAt,
    };
  }

  get results() {
    return this.gameResult;
  }

  get roundResults() {
    return this.allRoundResults;
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

  private resetIdle() {
    this.isIdle = false;
    this.idleAt = 0;
  }

  findEmptyPositions() {
    return this.positions[this.numberOfPlayers].filter((item) => not(this.occupiedPositions.includes(item)));
  }

  startGame(): void {
    this.dealerIndex++;
    this.cpi = this.dealerIndex;
    if (this.isStarted) return;
    this.isStarted = true;
    this.dealCards(true);
    this.activePlayer = this.gamePlayers[this.cpi];
    this.lastCardTaker = this.activePlayer;
    this.emitInitialData();
  }

  dealCards(firstDeal = false): void | null {
    if (this.deckOfCards.isEmpty()) {
      return null;
    }

    for (const player of this.gamePlayers) {
      const numberOfCards = this.dealCardsAmount - player.cardsInHand.length;
      if (numberOfCards > 0) {
        const dealCards = this.deckOfCards.distributeCards(numberOfCards);
        player.takeCardsInHand(dealCards);
        const serializedCards = dealCards.reduce(
          (acc, card) => [...acc, { rank: card.name, suit: card.suit }],
          [] as Card[],
        );
        this.io.to(player).emit('player-cards', serializedCards);
      }
    }
    if (firstDeal) {
      this.cards = this.deckOfCards.distributeCards(this.dealCardsAmount);
    }
  }

  getGamePlayersData(requestPlayer: Player) {
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

    const emptyPositions = this.findEmptyPositions();
    for (const position of emptyPositions) {
      transformedPlayerData[position] = {
        taken: false,
        name: '',
        time: PLAYER_MOVER_INTERVAL,
        cards: 0,
        isActive: false,
      };
    }

    const result = {} as TransformedPlayerData;
    for (const key in transformedPlayerData) {
      if (transformedPlayerData.hasOwnProperty(key)) {
        // Fake player data is only used for position shifting
        const fakePlayer = new Player('', '');
        fakePlayer.position = key as PlayerPositionType;
        const [position] = this.positionShift(requestPlayer, fakePlayer);
        result[position] = transformedPlayerData[fakePlayer.position];
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
      // Give a signal to the clients to remove remaining cards from the table
      this.gamePlayers.forEach((player) => {
        const [position] = this.positionShift(player, this.lastCardTaker);
        this.io.to(player).emit('take-card-from-table', {
          position,
          playerCard: null,
          tableCards: this.cards,
        });
      });
      this.cards = [];
    }

    Game.calculateScores(this.gamePlayers);
    this.latestRoundResults = R.clone(
      this.gamePlayers.map((player) => ({
        playerId: player.id,
        name: player.name,
        result: player.result,
        score: player.score,
        round: this.roundsCounter,
      })),
    );
    this.allRoundResults.push(R.clone(this.latestRoundResults));
    this.gamePlayers.forEach((player) => player.scoreReset());
    this.roundsCounter++;
    this.isIdle = true;
    this.idleTime = 30; // seconds
    this.idleAt = Date.now();
    this.io.to(this.gamePlayers).emit('one-game-finished', this.allRoundResults);
    // @ts-ignore TODO: add this union type in shared-types
    this.io.to(this.gamePlayers).emit('idle-game-before-next-round', this.idleTime);
    this.evaluateEndOfGame();
  }

  evaluateEndOfGame(): void {
    this.calculateGameResult();
    const scores = this.gameResult.map(({ score }) => score);
    const max = Math.max(...scores);
    const winnerScore = max >= this.maxScores ? max : null;
    if (winnerScore) {
      const gameResult = this.gameResult.find(({ score }) => score === winnerScore);
      const [winnerPlayer, secondWinner = null] = this.gamePlayers.filter(({ id }) => gameResult.playerId === id);
      if (!secondWinner) {
        this.winner = winnerPlayer;
        this.finishGame();
        return void 0;
      }
    }
    if (this.roundsCounter >= this.maxRounds) {
      const gameResult = this.gameResult.find(({ score }) => score === max);
      const [winnerPlayer, secondWinner = null] = this.gamePlayers.filter(({ id }) => gameResult.playerId === id);
      if (!secondWinner) {
        this.winner = winnerPlayer;
        this.finishGame();
        return void 0;
      }
    }

    // Game stops here and game ticker will call restartRound as it's needed
  }

  startNewRound(): void {
    this.resetIdle();
    this.restartGame();
  }

  restartGame(shuffle = true): void {
    this.isStarted = true;
    this.isFinished = false;
    this.deckOfCards = shuffle ? new Deck().shuffle() : new Deck();
    this.dealCards(true);
    this.emitInitialData();
  }

  emitInitialData(): void {
    this.players.forEach((player) => {
      if (this.isStarted) {
        this.io.to(player).emit('game:start');
      }
      const [position] = this.positionShift(player, player);
      this.io.to(player).emit('add-card-on-table', { cards: this.cardsOnTable, position });
      this.io.to(player).emit('player-cards', player.handCards);
      this.io.to(player).emit('game:players-data', this.getGamePlayersData(player));
      this.io.to(player).emit('game:round-results', this.allRoundResults);
      this.io.to(player).emit('game:results', this.gameResult, this.winner?.id);
    });
  }

  sendGameResults() {
    this.players.forEach((player) => {
      // @ts-ignore
      this.io.to(player).emit('final:game:results', this.gameResult, this.winner?.id);
    });
  }

  calculateGameResult() {
    this.gameResult = this.gamePlayers.map((player) => {
      const playerResults = this.allRoundResults.reduce((acc, roundResults) => {
        const playerResult = roundResults.find(({ playerId }) => playerId === player.id);
        if (playerResult) {
          acc.push(playerResult.score);
        }
        return acc;
      }, [] as number[]);
      const playerScore = playerResults.reduce((acc, result) => acc + result, 0);
      return {
        playerId: player.id,
        name: player.name,
        score: playerScore,
        isWinner: this.winner?.id === player.id,
      };
    });
  }

  finishGame(): void {
    this.finishedAt = Date.now();
    this.isFinished = true;
    this.calculateGameResult();
    this.io.to(this.gamePlayers).emit('full-game-finished', this.gameResult, this.winner?.id);
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

  updatePlayer(player: Player): void {
    const playerIndex = this.gamePlayers.findIndex((p) => p.id === player.id);
    if (playerIndex === -1) {
      throw new GameException(`Player with id ${player.id} not found`);
    }
    this.gamePlayers[playerIndex] = player;
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

  // This positions player as a base for each UI view to be on the bottom and other players will be rotated accordingly
  positionShift(player: Player, targetPlayer: Player) {
    const positionShift = this.positions[this.numberOfPlayers].indexOf(player.position);
    // Move player to the next position
    const mppIndex = { value: this.positions[this.numberOfPlayers].indexOf(targetPlayer.position) - positionShift };
    mppIndex.value = mppIndex.value >= 0 ? mppIndex.value : this.numberOfPlayers + mppIndex.value;

    return [this.positions[this.numberOfPlayers][mppIndex.value]];
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
        this.gamePlayers.forEach((player) => {
          const [position] = this.positionShift(player, targetPlayer);
          this.io.to(player).emit('take-card-from-table', {
            position,
            playerCard,
            tableCards,
          });
        });
        break;
      case ActionType.PLACE_CARD:
        this.cards.push(playerCard);
        targetPlayer.removeCardFromHand(playerCard);
        this.gamePlayers.forEach((player) => {
          const [position] = this.positionShift(player, targetPlayer);
          this.io.to(player).emit('add-card-on-table', { cards: playerCard, position });
        });
        break;
      default:
        throw new GameException(`Invalid action type [${type}]`);
    }
    // Changes active player
    this.changePlayer();

    this.gamePlayers.forEach((player) => {
      this.io.to(player).emit('player-cards', player.handCards);
      this.io.to(player).emit('game:players-data', this.getGamePlayersData(player));
    });
  }

  validateAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[]): void {
    if (player.not.equals(this.activePlayer)) throw new GameException('Action validation problem. Incorrect player.');
    if (type === ActionType.TAKE_CARDS) {
      if (tableCards.length === 0) {
        throw new GameException('Action validation problem. TableCards length is zero.');
      }
      if (not(this.tableContainsCards(tableCards))) {
        console.log({ player, type, playerCard, tableCards, gameDataCardsOnTable: this.cardsOnTable });
        throw new GameException(`Action validation problem. Cards do not match tableCards.`);
      }
    }
    if (type === ActionType.TAKE_CARDS && !playerCard.canTakeCards(tableCards)) {
      console.log({ player, type, playerCard, tableCards, gameDataCardsOnTable: this.cardsOnTable });
      throw new GameException('Action validation problem. Incorrect move.');
    }
  }

  public statistics() {
    return { message: 'Game finished!' };
  }

  public forceActivePlayerToPlaceRandomCard() {
    if (this.activePlayer && !this.isIdle) {
      this.playerAction(this.activePlayer, ActionType.PLACE_CARD, this.activePlayer.getRandomCardFromHand(), []);
    }
  }
}
