import {id as Id} from "../../helpers/ids";
import {Context} from "../../types";
import BaseController from "./BaseController";
import PlayerModel from "../../model/PlayerModel";
import GameModel from "../../model/GameModel";
import Game from './Game';
import {createGameSchema, enterGameSchema} from './validators/GameRequestValidator';
import ValidationErrorException from '../../exceptions/ValidationErrorException';
import {HttpCode} from '../../types/errorHandler';

class GameController extends BaseController implements Game {

  public createGame = async (ctx: Context): Promise<void> => {
    const validation = createGameSchema.validate(ctx.request.body);
    if (validation.error) {
      throw new ValidationErrorException(validation.error.details);
    }

    const roomId = Id.game();
    const userId = ctx.state.user?.id;
    const {isPublic, size, name} = validation.value;
    const player = GameModel.create(
      userId,
      roomId,
      Number(size),
      Boolean(isPublic),
      name,
    );
    PlayerModel.addPlayer(player, userId);

    ctx.body = roomId;
  }

  public getAllPublicGames = async (ctx: Context): Promise<void> => {
    ctx.body = GameModel.getGamesList();
  }

  public enterGame = async (ctx: Context): Promise<void> => {
    // id is roomId/gameId, name is playerName
    const validation = enterGameSchema.validate(ctx.request.body);
    if (validation.error) {
      throw new ValidationErrorException(validation.error.details);
    }

    const {id, name} = validation.value;
    const userId = ctx.state.user?.id;
    const room = GameModel.join(id, userId, name);

    ctx.body = room.getGameDetails();
  }

  public exitGame = async (ctx: Context): Promise<void> => {
    GameModel.leave(ctx.state.user?.id);

    ctx.status = HttpCode.accepted;
  }

}

export default new GameController();