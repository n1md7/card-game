import { room as Room } from "../config";
import { id as Id } from "../helpers/ids";
import { Context } from "../types";
import BaseController from "./BaseController";
import PlayerModel from "../model/PlayerModel";
import GameModel from "../model/GameModel";
import { isset } from "../helpers/extras";

class GameController extends BaseController {

  public create( ctx: Context ) {
    const roomId = Id.game();
    const userId = ctx.state.user.id;
    const { isPublic, size, name } = ctx.request.body;
    const roomSizes = [ Room.two, Room.three, Room.four ];

    if ( !roomSizes.includes( size ) ) {
      const errorMsg = `allowed sizes for the room are ${ roomSizes }`;

      return super.clientReject( ctx, errorMsg );
    }

    if ( !isset( isPublic ) ) {

      return super.clientReject( ctx, 'isPublic param is required' );
    }

    if ( !name ) {

      return super.clientReject( ctx, 'name param is required' );
    }
    try {
      const player = GameModel.create( userId, roomId, size, isPublic, name );
      PlayerModel.addPlayer( player, userId );

      return super.clientReturn( ctx, { roomId } );
    } catch ( { message } ) {

      return super.clientReject( ctx, message );
    }

  }

  public showAll( ctx: Context ) {
    super.clientReturn( ctx, {
      rooms: GameModel.getGamesList()
    } );
  }

  public join( ctx: Context ) {
    // id is roomId/gameId, name is playerName
    const { id, name } = ctx.request.body;
    const userId = ctx.state.user.id;
    if ( !id ) {

      return super.clientReject( ctx, 'required param [id] is missing' );
    }

    if ( !name ) {
      return super.clientReject( ctx, 'name param is required' );
    }

    try {
      const room = GameModel.join( id, userId, name );

      return super.clientReturn( ctx, {
        room: room.getGameDetails()
      } );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

  }

  public leave( ctx: Context ) {
    const { id } = ctx.state.user;

    try {
      GameModel.leave( id );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

    super.clientReturnOk( ctx );
  }

}

export default new GameController();
