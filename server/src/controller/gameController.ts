import setup from "../model/setup";
import { store } from "../store";
import { room as Room, token } from "../config";
import { id as Id } from "../helpers/ids";
import { Context } from "../types";
import Game from "../game/game";
import Player from "../game/player";
import BaseGameController from "./baseGameController";

class GameController extends BaseGameController {

  public status( ctx: Context ) {
    super.clientReturn( ctx, {
      status: "up"
    } );
  }

  public init( ctx: Context ) {
    const userId = Id.user();
    const jwToken = Id.jwt( { [ token.userId ]: userId } );
    setup.signUp( userId, null );
    super.clientReturn( ctx, {
      [ token.self ]: jwToken,
      userId
    } );
  }

  public create( ctx: Context ) {
    const roomId = Id.room();
    const userId = ctx.state.user.id;
    const { isPublic, size, name } = ctx.request.body;
    const roomSizes = [ Room.two, Room.three, Room.four ];

    if ( !roomSizes.includes( size ) ) {
      const errorMsg = `allowed sizes are for the room are ${ roomSizes }`;
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
      player = setup.createRoom( userId, roomId, size, isPublic );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

    store.addPlayerToken( player, userId );

    super.clientReturn( ctx, { roomId } );
  }

  public showRooms( ctx: Context ) {
    super.clientReturn( ctx, {
      rooms: store.getGamesList()
    } );
  }

  public joinRoom( ctx: Context ) {
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
      room = setup.joinRoom( id, userId );
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
      setup.leaveRoom( id );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }

    super.clientReturnOk( ctx );
  }

  public getUserInfo( ctx: Context ) {
    const { id } = ctx.state.user;
    let user = {};
    try {
      user = setup.getUserInfo( id );
    } catch ( { message } ) {
      return super.clientReject( ctx, message );
    }
    super.clientReturn( ctx, { user } );
  }

}

export default new GameController();
