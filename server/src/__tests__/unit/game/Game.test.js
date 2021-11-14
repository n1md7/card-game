import Player from '../../../game/Player';
import { id } from '../../../helpers';
import { gameStore, playerStore, userStore } from '../../../store';
import Game from '../../../game/Game';
import { SocketManager } from '../../../socket/manager';
import SocketIO from 'socket.io';
import GameModel from '../../../model/GameModel';
import PlayerModel from '../../../model/PlayerModel';
import Card from '../../../game/Card';
import { CardSuit } from 'shared-types';
import { CardRank, CardRankName } from 'shared-types/index';

describe('Game', function () {
  beforeEach(() => {
    gameStore.clearStorage();
    playerStore.clearStorage();
    userStore.clearStorage();
    jest.clearAllMocks();
  });

  it('should verify .getGameData()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    const gameData = game.getGameData(player);

    expect(gameData).toEqual({
      playerData: expect.any(Object),
      remainedCards: expect.any(Number),
    });

    expect(gameData.playerData).toEqual({
      left: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
      up: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
      right: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
      down: expect.objectContaining({
        taken: expect.any(Boolean),
        name: expect.any(String),
        progress: expect.any(Number),
        cards: expect.any(Number),
        score: expect.any(Number),
      }),
    });
  });

  it('should verify .playersHaveCard()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    player.position = 'down';
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;
    // No cards in hand
    expect(game.playersHaveCard()).toBeFalsy();

    player.takeCardsInHand([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);

    expect(game.playersHaveCard()).toBeTruthy();
  });

  it('should verify .cardsList()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    player.position = 'up';
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;
    game.dealCards(true);

    expect(game.cardsList).toHaveLength(4);
  });

  it('should verify .playerAlreadyInGameRoom()/.removePlayerFromTheGame()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Pem',
    };

    const player = new Player(payload.userId, payload.name);
    player.position = 'up';
    const game = new Game(
      payload.size,
      payload.roomId,
      payload.isPublic,
      payload.userId,
      payload.name,
      new SocketManager(SocketIO),
    );
    game.joinPlayer(player);
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;
    game.dealCards(true);

    expect(game.playerAlreadyInGameRoom(player)).toBeTruthy();
    game.removePlayerFromGameById(player.id);
    expect(game.playerAlreadyInGameRoom(player)).toBeFalsy();
  });

  it('should verify .joinPlayer()', function () {
    const Jim = new Player('Jim-id', 'Jim');
    const Pam = new Player('Pam-id', 'Pam');
    const Michael = new Player('Michael-id', 'Michael');
    const Dwight = new Player('Dwight-id', 'Dwight');
    const Andy = new Player('Andy-id', 'Andy');
    const args = [4, id.game(), true, id.player(), 'Bold game', new SocketManager(SocketIO)];
    const game = new Game(...args);
    game.joinPlayer(Jim);
    game.joinPlayer(Pam);
    game.joinPlayer(Michael);
    game.joinPlayer(Dwight);

    expect(() => {
      game.joinPlayer(Andy);
    }).toThrow('Table is full');
  });

  it('should verify .tableContainsCards()', function () {
    const Jim = new Player('Jim-id', 'Jim');
    const Pam = new Player('Pam-id', 'Pam');
    const args = [2, id.game(), true, id.player(), 'Bold game', new SocketManager(SocketIO)];
    const game = new Game(...args);
    game.joinPlayer(Jim);
    game.joinPlayer(Pam);
    game.startGame();

    const cards = game.cardsList.map((card) => new Card(card.suit, card.rank, card.rank));

    expect(game.tableContainsCards(cards)).toBeTruthy();
    expect(game.tableContainsCards([])).toBeFalsy();
  });

  it('should verify .removeCardsFromTable()', function () {
    const Jim = new Player('Jim-id', 'Jim');
    const Pam = new Player('Pam-id', 'Pam');
    const args = [2, id.game(), true, id.player(), 'Bold game', new SocketManager(SocketIO)];
    const game = new Game(...args);
    game.joinPlayer(Jim);
    game.joinPlayer(Pam);
    game.startGame();

    const cards = game.cardsList.map((card) => new Card(card.suit, card.rank, card.rank));
    game.removeCardsFromTable(cards);
    expect(game.tableContainsCards(cards)).toBeFalsy();
  });

  it('should do score calculation', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    Jason.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.CLUBS, CardRankName.NINE, CardRank.NINE),
    ]);
    // Jason have more cards (+2 points) and more clubs count (+1 point)
    Game.calculateScores([Alex, Jason]);
    expect(Alex.score).toBe(1);
    expect(Jason.score).toBe(4);
  });

  it('should do score calculation when amount of cards are draw', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    Jason.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    // Amount of cards are equal so no one get points so the amount of clubs is equal too
    Game.calculateScores([Alex, Jason]);
    expect(Alex.score).toBe(1);
    expect(Jason.score).toBe(1);
  });

  it('should do score calculation when only one player scores', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
    ]);
    Jason.scoreCards([new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE)]);
    Game.calculateScores([Alex, Jason]);
    expect(Alex.score).toBe(5);
    expect(Jason.score).toBe(0);
  });

  it('should do score calculation for 3 players', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    const Julie = new Player('Julie-id', 'Julie');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
    ]);
    Jason.scoreCards([new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE)]);
    Julie.scoreCards([
      new Card(CardSuit.SPADES, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.SPADES, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.CLUBS, CardRankName.THREE, CardRank.THREE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.CLUBS, CardRankName.JACK, CardRank.JACK),
      new Card(CardSuit.CLUBS, CardRankName.QUEEN, CardRank.QUEEN),
    ]);
    Game.calculateScores([Alex, Jason, Julie]);
    expect(Alex.score).toBe(2);
    expect(Jason.score).toBe(0);
    expect(Julie.score).toBe(3);
  });

  it('should do score calculation for 4 players', function () {
    const Alex = new Player('Alex-id', 'Alex');
    const Jason = new Player('Jason-id', 'Jason');
    const Julie = new Player('Julie-id', 'Julie');
    const Pablo = new Player('Pablo-id', 'Pablo');
    Alex.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO), // +1 point
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ]);
    Jason.scoreCards([
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN), // +1 point
    ]);
    Julie.scoreCards([
      new Card(CardSuit.SPADES, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.SPADES, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.CLUBS, CardRankName.THREE, CardRank.THREE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.CLUBS, CardRankName.JACK, CardRank.JACK),
      new Card(CardSuit.CLUBS, CardRankName.QUEEN, CardRank.QUEEN),
    ]);
    Pablo.scoreCards([
      new Card(CardSuit.HEARTS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.HEARTS, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.HEARTS, CardRankName.THREE, CardRank.THREE),
      new Card(CardSuit.HEARTS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.HEARTS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.HEARTS, CardRankName.JACK, CardRank.JACK),
      new Card(CardSuit.HEARTS, CardRankName.QUEEN, CardRank.QUEEN),
      new Card(CardSuit.HEARTS, CardRankName.KING, CardRank.KING),
    ]);
    Game.calculateScores([Alex, Jason, Julie, Pablo]);
    expect(Alex.score).toBe(1);
    expect(Jason.score).toBe(1);
    expect(Julie.score).toBe(1);
    expect(Pablo.score).toBe(2);
  });
});
