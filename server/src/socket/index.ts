import SocketIO, { Socket } from "socket.io";
import UserModel from "../model/UserModel";
import { isset } from "../helpers/extras";
import { JWTProps } from "../types";
import { token } from "../config";
import { playerJoin, playerMove } from "./events";
import jwt from "jsonwebtoken";

export default class SocketModule {
  private io: SocketIO.Server;

  constructor( io: SocketIO.Server ) {
    this.io = io;
  }

  public connectionHandler() {
    this.io.on( "connection", ( socket: Socket ) => {
      try {
        const verified = jwt.verify( socket.handshake.query[ 'token' ], process.env.JWT_SECRET );
        const userId = ( verified as JWTProps )[ token.userId ];
        const user = UserModel.getById( userId );
        if ( !isset( user ) ) {
          throw new Error( `We couldn't find a user with the id:${ userId }` );
        }
        user.socketId = socket.id;
        socket.on( "player:move", playerMove(user) );
        socket.on( "player:join", playerJoin(user) );

      } catch ( { message } ) {
        this.io.to( socket.id ).emit( "error", message );
      }

    } );
  }

  public sendUpdatesEvery( time: number = 1000 ) {
    return ( timeInterval: string ) => {
      return setInterval( () => {
        const users = UserModel.getUsers();
        for ( const userId in users ) {
          if ( users.hasOwnProperty( userId ) ) {
            const user = UserModel.getById( userId );
            if ( isset( user?.player ) ) {
              const game = user.player.getGame();
              this.io.to( user.socketId ).emit( "players", game.getPlayersData() );
              this.io.to( user.socketId ).emit( "player-cards", user.player.getHandCards() );
              this.io.to( user.socketId ).emit( "table-cards:add", game.getCardsList() );
            }
          }
        }
      }, time );
    }
  }


}