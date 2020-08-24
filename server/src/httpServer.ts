import http from "http";
import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import dotenv from "dotenv";
import bodyParser from "koa-bodyparser";

dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const httpPort = process.env.SERVER_PORT_HTTP;

const koaApp = new Koa();
const router = new Router( {
  prefix: '/api'
} );

const httpServer = http.createServer( koaApp.callback() );

if ( process.env.NODE_ENV.trim() === 'development' ) {
  koaApp.use( cors() );
}

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

