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
import { SocketManager } from '../socket/manager';
import serveIndexHTML from '../middleware/serveIndexHTML';
import handleApiNotFound from '../middleware/handleApiNotFound';
import Events from '../socket/events';
import { Token } from 'shared-types';
import os from 'os';

export default class Server {
  public koa: Koa;
  public httpServer: HttpServer;
  public ioServer: SocketIoServer;
  private readonly config: ConfigOptions;
  private readonly staticFolderPath: string;
  private socketModule: SocketModule;
  private socketManager: SocketManager;
  private serverTimer: NodeJS.Timer;

  constructor(config: ConfigOptions) {
    this.config = config;
    // Makes publicly accessible React build folder
    this.staticFolderPath = path.join(__dirname, config.server.staticFolderPath);
    // Allow any cross-domain requests when not Production environment
    // if (process.env.NODE_ENV === Env.Prod) {
    //   this.config.origin = process.env.ORIGIN;
    // }
  }

  get io() {
    return this.ioServer;
  }

  get socket() {
    return this.socketModule;
  }

  get timer() {
    return this.serverTimer;
  }

  init(): Server {
    this.koa = new Koa();
    this.httpServer = http.createServer(this.koa.callback());
    const router = routes(this.config);
    const indexHTMLPath = path.join(this.staticFolderPath, this.config.server.indexFile);
    this.koa.use(handleErrors);
    this.koa.use(
      cors({
        origin: (ctx: Koa.Context) => {
          if (this.config.origins.includes(ctx.headers.origin)) {
            return ctx.headers.origin;
          }
          throw new Error(
            `Request referer=>origin=[${ctx.request.headers.referer}]=>[${ctx.headers.origin}] rejected by CORs.` +
              ` Requests are allowed only from: ${this.config.origins.join(', ')}`,
          );
        },
        allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
        allowHeaders: ['Content-Type', Token.auth],
        exposeHeaders: [Token.auth],
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
    this.koa.on(KoaEvent.serverError, (errorMessage) => logWrite.error(`[server] ${errorMessage}`));
    this.koa.on(KoaEvent.socketError, (errorMessage) => logWrite.error(`[socket] ${errorMessage}`));
    this.koa.on(KoaEvent.debug, (debugMessage) => logWrite.error(`${debugMessage}`));

    return this;
  }

  startServer(): Promise<HttpServer> {
    const { port, hostname, apiContextPath } = this.config.server;

    return new Promise((resolve) => {
      this.httpServer.listen(port, hostname, function () {
        if (process.env.NODE_ENV !== Env.Test) {
          logWrite.debug(`Example API endpoint - http://${hostname}:${port}${apiContextPath}/v1/storage`);
          if (process.env.NODE_ENV === Env.Dev) {
            const [{ address = '[::1]' }] = Object.values(os.networkInterfaces())
              .flat()
              .filter((item) => !item.internal && item.family === 'IPv4');
            logWrite.debug(`Your local IP: ${address}`);
          }
          logWrite.debug('Server (re)started! Ready to serve the master');
        }
        resolve(this);
      });
    });
  }

  attachSocket(): SocketModule {
    this.ioServer = SocketIO(this.httpServer, {
      path: '/socket.io',
      serveClient: false,
      // below are engine.IO options
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });

    this.socketModule = new SocketModule(this.ioServer, this.koa, new Events(this.koa));
    this.socketManager = new SocketManager(this.ioServer);
    this.serverTimer = this.socketModule.sendUpdatesEvery(100);

    return this.socketModule;
  }
}
