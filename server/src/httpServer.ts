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
import { store } from "./store";
import { id } from "./helpers/ids";
import Game from "./game/game";
import Player from "./game/player";

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
}


const game = new Game( 4 );

game.joinPlayer( new Player( "giorgi" ), 'left' );
game.joinPlayer( new Player( "harry" ), 'up' );
game.joinPlayer( new Player( "fifaia" ), 'down' );
game.joinPlayer( new Player( "megan fox" ), 'right' );

io.on( "connection", ( socket ) => {
  console.log( "socket connection" );
} );

setInterval( () => {
  io.emit( "player-cards", game.activePlayer.getHandCards() );

  io.emit( "table-cards", game.getCardsList());
  io.emit( "players", game.getPlayersData() );
}, 1000 );


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

