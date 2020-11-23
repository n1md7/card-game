import http from "http";
import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import SocketIO from "socket.io"

const httpPort = process.env.SERVER_PORT_HTTP;
const developmentMode = process.env.NODE_ENV.trim() === 'development';
const koaApp = new Koa();
const router = new Router( {
  prefix: '/api'
} );

const httpServer = http.createServer( koaApp.callback() );
const io = SocketIO( httpServer );

if ( developmentMode ) {
  koaApp.use( cors() );
}

koaApp
  .use( bodyParser() )
  .use( router.routes() )
  .use( router.allowedMethods() );

if ( process.env.NODE_ENV.trim() !== 'test' ) {
  // start the server
  httpServer.listen( httpPort, () => {
    if ( developmentMode ) {
      console.log( `Server started at http://localhost:${ httpPort }` );
    }
  } );
}

// This is for tests
export {
  httpServer,
  router,
  io
}

