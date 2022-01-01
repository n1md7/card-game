import { id as Id } from '../../helpers/ids';
import { Context, HttpCode } from '../../types';
import BaseController from './BaseController';
import PlayerModel from '../../model/PlayerModel';
import GameModel from '../../model/GameModel';
import GameInterface from './interfaces/GameInterface';
import { createGameSchema, enterGameSchema } from './validators/GameRequestValidator';
import ValidationErrorException from '../../exceptions/ValidationErrorException';
import { gameStore, playerStore, userStore } from '../../store';
import { SocketManager } from '../../socket/manager';
import Player from '../../game/Player';
import Game from '../../game/Game';

class GameController extends BaseController implements GameInterface {
  public createGame = async (ctx: Context & { socketManager: SocketManager }): Promise<void> => {
    const validation = createGameSchema.validate(ctx.request.body);
    if (validation.error) {
      throw new ValidationErrorException(validation.error.details);
    }

    const roomId = Id.game();
    const userId = ctx.state.user?.id;
    const { isPublic, size, name } = validation.value;
    const player = new Player(userId, name);
    const game = new Game(size, roomId, isPublic, userId, name, ctx.socketManager);
    game.joinPlayer(player);
    GameModel.create(userId, player, game);
    PlayerModel.addPlayer(player, userId);

    ctx.body = roomId;
  };

  public getAllPublicGames = async (ctx: Context): Promise<void> => {
    ctx.body = GameModel.getGamesList(true);
  };

  public enterGame = async (ctx: Context): Promise<void> => {
    // id is roomId/gameId, name is playerName
    const validation = enterGameSchema.validate(ctx.request.body);
    if (validation.error) {
      throw new ValidationErrorException(validation.error.details);
    }

    const { id, name } = validation.value;
    const userId = ctx.state.user?.id;
    const room = GameModel.join(id, userId, name);

    ctx.body = room.details;
  };

  public exitGame = async (ctx: Context): Promise<void> => {
    GameModel.leave(ctx.state.user?.id);

    ctx.status = HttpCode.accepted;
  };

  public showStoreData = async (ctx: Context): Promise<void> => {
    ctx.body = {
      GameStore: gameStore.getStorage(),
      PlayerStore: playerStore.getStorage(),
      UserStore: userStore.getStorage(),
    };
  };
}

export default new GameController();
