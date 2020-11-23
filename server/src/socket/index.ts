import { io } from "../httpServer";
import { JWTProps } from "../types";
import { token } from "../config";
import UserModel from "../model/UserModel";
import { isset } from "../helpers/extras";
import jwt from "jsonwebtoken";
import { playerJoin } from "./events";

io.on( "connection", ( socket ) => {
  try {
    const verified = jwt.verify( socket.handshake.query[ 'token' ], process.env.JWT_SECRET );
    const userId = ( verified as JWTProps )[ token.userId ];
    const user = UserModel.getById( userId );
    if ( !isset( user ) ) {
      throw new Error( `We couldn't find a user with the id:${ userId }` );
    }
    user.socketId = socket.id;
  } catch ( { message } ) {
    io.to( socket.id ).emit( "error", message );
  }

  socket.on( "player:join", playerJoin);
} );

setInterval( () => {
  const users = UserModel.getUsers();
  for ( const userId in users ) {
    if ( users.hasOwnProperty( userId ) ) {
      const user = UserModel.getById( userId );
      if ( isset( user?.player ) ) {
        const game = user.player.getGame();
        io.to( user.socketId ).emit( "players", game.getPlayersData() );
        io.to( user.socketId ).emit( "player-cards", user.player.getHandCards() );
        io.to( user.socketId ).emit( "table-cards:add", game.getCardsList() );
      }
    }
  }
}, 1000 );