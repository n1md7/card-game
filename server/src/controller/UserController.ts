import { room as Room, token } from "../config";
import { id as Id } from "../helpers/ids";
import { Context } from "../types";
import Game from "../game/Game";
import Player from "../game/Player";
import BaseController from "./BaseController";
import PlayerModel from "../model/PlayerModel";
import GameModel from "../model/GameModel";
import RoomModel from "../model/RoomModel";
import AuthModel from "../model/AuthModel";
import UserModel from "../model/UserModel";

class GameController extends BaseController {

  public status( ctx: Context ) {
    super.clientReturn( ctx, {
      status: "up"
    } );
  }

  public init( ctx: Context ) {
    const userId = Id.user();
    const jwToken = Id.jwt( { [ token.userId ]: userId } );
    AuthModel.signUp( userId, null );
    super.clientReturn( ctx, {
      [ token.self ]: jwToken,
      userId
    } );
  }

  public create( ctx: Context ) {
    const roomId = Id.game();
    const userId = ctx.state.user.id;
    const { isPublic, size, name } = ctx.request.body;
    const roomSizes = [ Room.two, Room.three, Room.four ];

    if ( !roomSizes.includes( size ) ) {
      const errorMsg = `allowed sizes for the room are ${ roomSizes }`;
      return super.clientReject( ctx, errorMsg );
    }

    if ( [ null, undefined ].includes( isPublic ) ) {
      return super.clientReject( ctx, 'isPublic param is required' );
    }

    if ( !name ) {
      return super.clientReject( ctx, 'name param is required' );
    }

    let player: Player | Error = null;
    try {
      player = RoomModel.create( userId, roomId, size, isPublic, name );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

    PlayerModel.addPlayer( player, userId );

    super.clientReturn( ctx, { roomId } );
  }

  public showRooms( ctx: Context ) {
    super.clientReturn( ctx, {
      rooms: GameModel.getGamesList()
    } );
  }

  public joinRoom( ctx: Context ) {
    // id is roomId/gameId, name is playerName
    const { id, name } = ctx.request.body;
    const userId = ctx.state.user.id;
    if ( !id ) {
      return super.clientReject( ctx, 'required param [id] is missing' );
    }

    if ( !name ) {
      return super.clientReject( ctx, 'name param is required' );
    }

    let room: Game;
    try {
      room = RoomModel.join( id, userId, name );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

    super.clientReturn( ctx, {
      room: room.getGameData()
    } );
  }

  public leaveRoom( ctx: Context ) {
    const { id } = ctx.state.user;

    try {
      RoomModel.leave( id );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

    super.clientReturnOk( ctx );
  }

  public getUserInfo( ctx: Context ) {
    const { id } = ctx.state.user;
    let user = {};
    try {
      user = UserModel.getUserInfo( id );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }
    super.clientReturn( ctx, { user } );
  }

}

export default new GameController();
