import Player from '../../../game/Player';
import { CardRank, CardRankName, CardSuit } from 'shared-types';
import { Card } from '../../../game/Card';
import { id } from '../../../helpers/ids';
import { gameStore, playerStore, userStore } from '../../../store';
import Game from '../../../game/Game';
import GameModel from '../../../model/GameModel';
import PlayerModel from '../../../model/PlayerModel';
import { SocketManager } from '../../../socket/manager';
import SocketIO from 'socket.io';

describe('Player', function () {
  beforeEach(() => {
    gameStore.clearStorage();
    playerStore.clearStorage();
    userStore.clearStorage();
    jest.clearAllMocks();
  });

  it('should verify properties/methods', function () {
    const player = new Player(id.player());
    expect(player.data).toBeDefined();
    expect(player.handCards).toBeDefined();
    expect(player.id).toBeDefined();
    expect(player.takeCardsInHand).toBeDefined();
    expect(player.equals).toBeDefined();
    expect(player.scoreCards).toBeDefined();
    expect(player.removeCardFromHand).toBeDefined();
    expect(player.placeRandomCardFromHand).toBeDefined();
    expect(player.placeCardFromHand).toBeDefined();
    expect(player.takeCardsFromTable).toBeDefined();
    expect(player.calculateResult).toBeDefined();
  });

  it('should verify gameId/game/data/id', function () {
    const playerId = id.player();
    const playerName = 'Jenny';
    const player = new Player(playerId, playerName);
    // No game created
    player.gameId = id.game();
    expect(player.game).toBeUndefined();
    expect(player.data).toEqual({
      cards: 0,
      name: playerName,
      progress: 0,
      score: undefined,
      taken: true,
    });
    expect(player.id).toBe(playerId);
  });

  it('should check records in store', function () {
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
    GameModel.create(payload.userId, player, game);
    PlayerModel.addPlayer(player, payload.userId);
    player.gameId = payload.roomId;

    expect(gameStore.getById(payload.roomId)).toBeDefined();
    expect(playerStore.getById(payload.userId)).toBeDefined();
  });

  it('should test takeCardsInHand()', function () {
    const player = new Player('id', 'Hey');
    player.takeCardsInHand([
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
    ]);

    expect(player.cards).toHaveLength(2);
  });

  it('should test equals()', function () {
    const player = new Player('id', 'Mom');
    // The same id but name different.
    const anotherPlayer = new Player('id', 'Dude');
    expect(player.equals(anotherPlayer)).toBeTruthy();
  });

  it('should test scoreCards()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Jenny',
    };

    const player = new Player(payload.userId, payload.name);
    // The same id but name different.
    const anotherPlayer = new Player(payload.userId, 'Dude');
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

    const scoredCards = [
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ];
    player.scoreCards(scoredCards);
    player.calculateResult();

    expect(player.result).toEqual({
      numberOfClubs: 1,
      numberOfCards: scoredCards.length,
      hasTwoOfClubs: false,
      hasTenOfDiamonds: false,
    });
  });

  it('should test removeCardFromHand()', function () {
    const player = new Player('P-123', 'Jenny');
    const cards = [
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ];
    player.takeCardsInHand(cards);
    expect(player.cards).toHaveLength(3);
    player.removeCardFromHand(new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE));
    expect(player.cards).toHaveLength(2);
  });

  it('should throw when wrong card in removeCardFromHand()', function () {
    const player = new Player('P-123', 'Jenny');
    const cards = [
      new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ];
    player.takeCardsInHand(cards);
    expect(() => {
      player.removeCardFromHand(new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN));
    }).toThrow('You are not holding such card in hand. Thus, it cannot be removed.');
  });

  it('should test placeCardFromHand()/placeRandomCardFromHand()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Lucy',
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
    player.gameId = payload.roomId;
    const playerActionMock = jest.fn();
    jest.spyOn(game, 'playerAction').mockImplementation(playerActionMock);
    gameStore.setById(game.getGameId(), game);
    const cards = [
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ];
    player.takeCardsInHand(cards);
    player.placeCardFromHand(new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE));
    expect(playerActionMock).toHaveBeenCalled();
    player.placeRandomCardFromHand();
    expect(playerActionMock).toHaveBeenCalledTimes(2);
    expect(() => {
      // Trying to place wrong card
      player.placeCardFromHand(new Card(CardSuit.SPADES, CardRankName.NINE, CardRank.NINE));
    }).toThrow('You are not holding such card in hand. Thus, it cannot be placed.');
  });

  it('should test takeCardsFromTable()', function () {
    const payload = {
      size: 2,
      isPublic: true,
      roomId: id.game(),
      userId: id.player(),
      name: 'Lucy',
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
    player.gameId = payload.roomId;
    const playerActionMock = jest.fn();
    jest.spyOn(game, 'playerAction').mockImplementation(playerActionMock);
    gameStore.setById(game.getGameId(), game);
    const cards = [new Card(CardSuit.CLUBS, CardRankName.FOUR, CardRank.FOUR)];
    const tableCards = [
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
    ];
    player.takeCardsInHand(cards);
    player.takeCardsFromTable(new Card(CardSuit.CLUBS, CardRankName.FOUR, CardRank.FOUR), tableCards);
    expect(playerActionMock).toHaveBeenCalled();
    expect(() => {
      // Trying to place wrong card
      player.placeCardFromHand(new Card(CardSuit.SPADES, CardRankName.NINE, CardRank.NINE));
    }).toThrow('You are not holding such card in hand. Thus, it cannot be placed.');
  });
});
