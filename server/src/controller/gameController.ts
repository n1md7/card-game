import setup from "../model/setup";
import { store } from "../store";

import { room as Room, token } from "../config";
import { id as Id } from "../helpers/ids";
import { Context } from "../types";
import jwt from "jsonwebtoken";
import Game from "../game/game";
import Player from "../game/player";

class GameController {

  private createContextBody(ctx: Context, status: boolean, message: string, others: any = {}) {
    ctx.body = {
      ok: status,
      msg: message,
      ...others
    }
  }

  public status( ctx: Context ) {
    this.createContextBody(ctx, true, "up");
  }

  public init( ctx: Context ) {
    const userId = Id.user();
    const jwToken = Id.jwt( { [ token.userId ]: userId } );
    setup.signUp( userId, null );
    this.createContextBody(ctx, true, "up", { [ token.self ]: jwToken, userId, jwToken: jwt.verify( jwToken, token.secret ) });
  }

  public create( ctx: Context ) {
    const roomId = Id.room();
    const userId = ctx.state.user.id;
    const { isPublic, size, name } = ctx.request.body;
    const roomSizes = [ Room.two, Room.three, Room.four ];

    if ( !roomSizes.includes( size ) ) {
      this.createContextBody(ctx, false, `allowed sizes are for the room are ${ roomSizes }`);
      return;
    }

    if ( [ null, undefined ].includes( isPublic ) ) {
      this.createContextBody(ctx, false, 'isPublic param is required');
      return;
    }

    if ( !name ) {
      this.createContextBody(ctx, false, 'name param is required');
      return;
    }
    let player : Player | Error = null;
    try {
      player = setup.createRoom( userId, roomId, size, isPublic );
    } catch ( { message } ) {
      this.createContextBody(ctx, false, message);
      return;
    }

    store.addPlayerToken(player, userId);

    this.createContextBody(ctx, true, "", {roomId});

  }

  public showRooms( ctx: Context ) {
    this.createContextBody(ctx, true, "", {rooms: store.getGamesList()});
  }

  public joinRoom( ctx: Context ) {
    const { id, name } = ctx.request.body;
    const userId = ctx.state.user.id;
    if ( !id ) {
      this.createContextBody(ctx, false, 'required param [id] is missing');
      return;
    }

    if ( !name ) {
      this.createContextBody(ctx, false, 'name param is required');
      return;
    }

    let room : Game;
    try {
      room = setup.joinRoom( id, userId);

    } catch ( { message } ) {
      this.createContextBody(ctx, false, message);
      return;
    }

    this.createContextBody(ctx, true, "", {room: room.getGameData()});
  }

  public leaveRoom( ctx: Context ) {
    const { id } = ctx.state.user;

    try {
      setup.leaveRoom( id );
    } catch ( { message } ) {
      this.createContextBody(ctx, false, message);
      return;
    }

    this.createContextBody(ctx, true, "");
  }

  public getUserInfo( ctx: Context ) {
    const { id } = ctx.state.user;
    let user = {};
    try {
      user = setup.getUserInfo( id );
    } catch ( { message } ) {
      this.createContextBody(ctx, false, message);
      return;
    }
    this.createContextBody(ctx, true, "", {user});
  }

}

export default new GameController();