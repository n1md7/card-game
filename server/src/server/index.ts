import Koa, { Context, Next } from 'koa';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import logWrite from '../logger';
import routes from '../routes';
import handleErrors from '../middleware/ErrorHandler';
import { Env, KoaEvent } from '../types';
import { ConfigOptions } from '../types/config';
import path from 'path';
import http, { Server as HttpServer } from 'http';
import SocketIO, { Server as SocketIoServer } from 'socket.io';
import SocketModule from '../socket';
import SocketManager from '../socket/manager';
import serveIndexHTML from '../middleware/serveIndexHTML';
import handleApiNotFound from '../middleware/handleApiNotFound';

export default class Server {
  public koa: Koa;
  public httpServer: HttpServer;
  private io: SocketIoServer;
  private readonly config: ConfigOptions;
  private readonly staticFolderPath: string;
  private socketModule: SocketModule;
  private socketManager: SocketManager;

  constructor(config: ConfigOptions) {
    this.config = config;
    // Makes publicly accessible React build folder
    this.staticFolderPath = path.join(__dirname, config.server.staticFolderPath);
    // Allow any cross-domain requests when not Production environment
    if (process.env.NODE_ENV === Env.Prod) {
      this.config.origin = process.env.ORIGIN;
    }
  }

  init(): Server {
    this.koa = new Koa();
    this.httpServer = http.createServer(this.koa.callback());
    this.io = SocketIO(this.httpServer, {
      path: '/socket.io',
      serveClient: false,
      // below are engine.IO options
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });
    const router = routes(this.config);
    const indexHTMLPath = path.join(this.staticFolderPath, this.config.server.indexFile);
    this.koa.use(handleErrors);
    this.koa.use(
      cors({
        origin: this.config.origin,
        credentials: true,
      }),
    );
    this.koa.use(bodyParser());
    this.koa.use(router.allowedMethods());
    this.koa.use(async (ctx: Context, next: Next) => {
      ctx.socketManager = this.socketManager || {};
      await next();
    });
    this.koa.use(router.routes());
    // Serve files from public static folder
    this.koa.use(serve(this.staticFolderPath));
    // When not found request goes to api endpoint return JSON formatted error
    this.koa.use(handleApiNotFound(this.config.server.apiContextPath, this.koa));
    // Redirect everything else to index.html - for React-router
    this.koa.use(serveIndexHTML(indexHTMLPath, this.koa));
    this.koa.on(KoaEvent.serverError, (errorMessage) => {
      logWrite.error(`[server] ${errorMessage}`);
    });
    this.koa.on(KoaEvent.socketError, (errorMessage) => {
      logWrite.error(`[socket] ${errorMessage}`);
    });
    this.koa.on('debug', (debugMessage) => {
      logWrite.error(`${debugMessage}`);
    });

    return this;
  }

  startSocket(): SocketModule {
    this.socketModule = new SocketModule(this.io, this.koa);
    this.socketManager = new SocketManager(this.io);
    this.socketModule.connectionHandler();
    this.socketModule.sendUpdatesEvery(100)('milliseconds');

    return this.socketModule;
  }

  startServer(): HttpServer {
    const { port, hostname, apiContextPath } = this.config.server;

    return this.httpServer.listen(port, hostname, () => {
      logWrite.debug(`Health-check - http://${hostname}:${port}/health-check`);
      logWrite.debug(`Example API endpoint - http://${hostname}:${port}${apiContextPath}/v1/users`);
      logWrite.debug('Server (re)started!');
    });
  }
}
