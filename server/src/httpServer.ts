import http from "http";
import Koa from "koa";
import Router from "koa-router";
import dotenv from "dotenv";
import serve from "koa-static";
import path from "path";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const httpPort = process.env.SERVER_PORT_HTTP;

const app = new Koa();
const router = new Router();

const httpServer = http.createServer(app.callback());

// if (process.env.NODE_ENV === 'development') app.use(cors());


app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async (ctx, next) => {
        // custom middleware
        // ctx.cookies.set('test-cookie', 'test-value');
        await next();
    });

// make public all content inside ../public folder
// mainly for testing(socket.io),
// public files will be served from apache/nginx

app.use(serve(path.join(__dirname, '../public')));

// start the server
httpServer.listen(httpPort, () => {
    console.log(`server started at http://localhost:${httpPort}`);
});



export {
    httpServer,
    router
};

