import http from "http";
import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import dotenv from "dotenv";
import bodyParser from "koa-bodyparser";
import Deck from "./game/deck";
import path from "path";
import serve from "koa-static";
import SocketIO from "socket.io"
import { id } from "./helpers/ids";
import Game from "./game/game";
import Player from "./game/player";
import jwt from "jsonwebtoken";
import { token } from "./config";
import { cat } from "shelljs";
import UserModel from "./model/user";

dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const httpPort = process.env.SERVER_PORT_HTTP;

const koaApp = new Koa();
const router = new Router( {
  prefix: '/api'
} );

const httpServer = http.createServer( koaApp.callback() );
const io = SocketIO( httpServer );

if ( process.env.NODE_ENV.trim() === 'development' ) {
  koaApp.use( cors() );
  console.log( "development" )
}


/*const game = new Game( 4 );

game.joinPlayer( new Player( "giorgi" ), 'left' );
game.joinPlayer( new Player( "harry" ), 'up' );
game.joinPlayer( new Player( "fifaia" ), 'down' );
game.joinPlayer( new Player( "megan fox" ), 'right' );*/
interface TokenProps {
  "userId": string,
  "iat": number,
  "exp": number
}

io.on( "connection", ( socket ) => {
  let verifiedToken: object | string = null;
  try {
    verifiedToken = jwt.verify( socket.handshake.query[ 'token' ], token.secret );
  } catch ( error ) {
    return;
  }
  const user = UserModel.getById( ( verifiedToken as TokenProps )[ token.userId ] );
  if ( [ undefined, null ].includes( user ) )
    return;
  user.socketId = socket.id;
} );


setInterval( () => {
  const users = UserModel.getUsers();
  for ( const userId in users ) {
    if ( users.hasOwnProperty( userId ) ) {
      try {
        const user = UserModel.getById( userId );
        const game = user.player.getGame();
        if ( ![ undefined, null ].includes( user.player ) ) {
          io.to( user.socketId ).emit( "player-cards", user.player.getHandCards() );
          io.to( user.socketId ).emit( "table-cards:add", game.getCardsList() );
          io.to( user.socketId ).emit( "players", game.getPlayersData() );
        }
      } catch ( e ) {}
    }
  }
}, 1000 );

/*setInterval( () => {
  for(const userid in store.getUsers()) {
    const user = store.getUserById(userid);
    const game = user.player.getGame();
    socket.broadcast.to(user.socketId).emit('my message', messageData);
  }
  io.emit( "player-cards", [ { rank: "queen", suit: "spades" } ] );
  io.emit( "table-cards:add", game.getCardsList());
  io.emit( "players", game.getPlayersData() );
}, 1000 );*/

koaApp
  .use( bodyParser() )
  .use( router.routes() )
  .use( router.allowedMethods() );

if ( process.env.NODE_ENV.trim() !== 'test' ) {
  // start the server
  httpServer.listen( httpPort, () => {
    if ( process.env.NODE_ENV.trim() === 'development' ) {
      console.log( `server started at http://localhost:${ httpPort }` );
    }
  } );
}


// This is for tests
export {
  httpServer,
  router
}

