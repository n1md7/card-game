import Koa, {Context} from "koa";
import serve from "koa-static";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import log from "../logger";
import routes from "../routes";
import ErrorHandler from "../middleware/ErrorHandler";
import {Env} from "../types";
import {ConfigOptions} from "../types/config";
import path from "path";
import fs from "fs";
import http, {Server as HttpServer} from "http";
import SocketIO, {Server as SocketIoServer} from "socket.io"
import {HttpCode, HttpText} from '../types/errorHandler';
import Socket from "../socket";
import SocketManager from "../socket/manager";

export default class App {
  koa: Koa;
  socket: Socket;
  io: SocketIoServer;
  config: ConfigOptions;
  httpServer: HttpServer;
  staticFolderPath: string;
  socketManager: SocketManager;

  constructor(config: ConfigOptions) {
    this.config = config;
    this.koa = new Koa();
    this.httpServer = http.createServer(this.koa.callback());
    this.io = SocketIO(this.httpServer, {
      path: '/socket.io',
      serveClient: false,
      // below are engine.IO options
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false
    });
    this.socket = new Socket(this.io);
    this.socketManager = new SocketManager(this.io);
    // Makes publicly accessible React build folder
    this.staticFolderPath = path.join(__dirname, config.server.staticFolderPath);
    // Allow any cross-domain requests when not Production environment
    if (process.env.NODE_ENV === Env.Prod) {
      this.config.origin = process.env.ORIGIN;
    }
  }

  init(): App {
    const router = routes(this.config);
    this.koa.use(ErrorHandler.handle);
    this.koa.use(cors({
      origin: this.config.origin,
      credentials: true
    }));
    this.koa.use(bodyParser());
    this.koa.use(router.allowedMethods());
    this.koa.use(router.routes());
    // Serve files from public static folder
    this.koa.use(serve(this.staticFolderPath));
    // Redirect all requests to index.html - for React-router
    this.koa.use(async (ctx: Context, next) => {
      if (ctx.path.indexOf(this.config.server.apiContextPath) !== -1) {
        // Request came to api endpoint
        log.error(`${ctx.request.path} - is not a valid route!`);
        ctx.status = HttpCode.notFound;
        return ctx.body = {
          code: HttpCode.notFound,
          message: HttpText.notFound,
        };
      }

      try {
        const index = path.join(this.staticFolderPath, this.config.server.indexFile);
        ctx.body = fs.readFileSync(index, 'utf8');
      } catch (error) {
        ctx.body = `
            <h2>Not Found 404</h2>
            <p><b>index.html</b> not found in <b>build</b> folder</p>
            <p>Make sure you run <code>npm run build</code> command</p>
        `;
        ctx.status = 404;
        log.error(error.message || error?.toString());
      }
    });

    this.koa.on('error', errorMessage => {
      log.error(errorMessage);
    });

    return this;
  }

  startSocket(): Socket {
    try {
      this.socket.connectionHandler();
      this.socket.sendUpdatesEvery(100)("milliseconds");
    } catch (error) {
      log.error(error.message || error?.toString());
    }

    return this.socket;
  }

  startServer(): HttpServer {
    const {port, hostname, apiContextPath} = this.config.server;

    return this.httpServer.listen(port, hostname, () => {
      log.debug(`Health-check - http://${hostname}:${port}/health-check`);
      log.debug(`Example API endpoint - http://${hostname}:${port}${apiContextPath}/v1/users`);
      log.debug('Server (re)started!');
    });
  }
}
