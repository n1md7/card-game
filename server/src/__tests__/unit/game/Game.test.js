import Player from '../../../game/Player';
import { id } from '../../../helpers/ids';
import { gameStore, playerStore, userStore } from '../../../store';
import Game from '../../../game/Game';
import { SocketManager } from '../../../socket/manager';
import SocketIO from 'socket.io';
import GameModel from '../../../model/GameModel';
import PlayerModel from '../../../model/PlayerModel';
import { Card } from '../../../game/Card';
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
});
