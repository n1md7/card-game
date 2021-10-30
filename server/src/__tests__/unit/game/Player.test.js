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
  });

  it('should verify properties/methods', function () {
    const player = new Player(id.player());
    expect(player.data).toBeDefined();
    expect(player.handCards).toBeDefined();
    expect(player.id).toBeDefined();
    expect(player.playerTakesCardsInHand).toBeDefined();
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

  it('should test equals()', function () {
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
});
