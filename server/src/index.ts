import http from "http";
import Koa from "koa";
import Router from "koa-router";
import socketIO from "socket.io";
import dotenv from "dotenv";
import serve from "koa-static";
import path from "path";
import {SocketCallback} from "./types";
// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const httpPort = process.env.SERVER_PORT_HTTP;

const app = new Koa();
const router = new Router();

const httpServer = http.createServer(app.callback());
// Pass a http.Server instance to the listen method
const io = socketIO.listen(httpServer);

app.use(router.routes())
    .use(router.allowedMethods())
    .use(async (ctx, next) => {
        // custom middleware
        ctx.cookies.set('test-cookie', 'test-value');
        await next();
    });

// make public all content inside ../public folder
// mainly for testing(socket.io),
// public files will be served from apache/nginx
app.use(serve(path.join(__dirname, '../public')));

// To check server status
router.get('/status-check', ctx => ctx.body = {
    status: "up"
});

io.on('connection', function (socket: any) {
    console.log("Connected successfully to the socket ...");
    socket.on('create', function (message: any) {
        console.log(message);
    });
    socket.on('join', function (message: any) {
        console.log(message);
    });
});

// start the server
httpServer.listen(httpPort, () => {
    console.log(`server started at http://localhost:${httpPort}`);
});
