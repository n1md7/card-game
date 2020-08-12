import http from "http";
import Koa from "koa";
import Router from "koa-router";
import socketIO from "socket.io";
import dotenv from "dotenv";
import serve from "koa-static";
import path from "path";
import {SetupGame} from "./socket/setup/setup";
// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const httpPort = process.env.SERVER_PORT_HTTP;

const app = new Koa();
const router = new Router();

const httpServer = http.createServer(app.callback());
// Pass a http.Server instance to the listen method
const io = socketIO(httpServer, {
    cookie: true
});

// Create game setup instance
const setup = new SetupGame();


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
router.get('/status-check', ctx => {
    ctx.body = {
        status: "up"
    }
});

io.on('connection', function (socket: any) {
    console.log("A user is connected successfully to the socket ...");
    console.log('Current socket ID: ', socket.id)
    // pass the socket reference
    setup.socket = socket;
    socket.on('do:create-room', () => setup.createRoom());
    socket.on('do:join-room', (roomId: string) => setup.joinRoom(roomId));
    // socket.join('mothersucker');
    socket.on('do:get-rooms-list', () => setup.showRooms());
    socket.on('disconnect', () => setup.disconnect())
});

// start the server
httpServer.listen(httpPort, () => {
    console.log(`server started at http://localhost:${httpPort}`);
});

