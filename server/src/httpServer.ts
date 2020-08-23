import http from "http";
import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import dotenv from "dotenv";
import serve from "koa-static";
import path from "path";
import bodyParser from "koa-bodyparser";
import auth from "./middleware/auth";
import fs from "fs";

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
  .use( auth )
  .use( bodyParser() )
  // .use( Logger() )
  .use( router.routes() )
  .use( router.allowedMethods() );

// make public all content inside ../public folder
if ( process.env.NODE_ENV === 'development' ) {
  // koaApp.use(serve(path.join(__dirname, '../public')));
  koaApp.use( serve( path.join( __dirname, '../../game/build' ) ) );
}

koaApp
  .use( async ctx => {
    // everything else point to index.html
    // this is for react router
    ctx.set( 'content-type', 'text/html' );
    ctx.body = fs.readFileSync( path.join( __dirname, '../../game/build/index.html' ) );
  } );

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

