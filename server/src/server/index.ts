import Koa, { Context, Next } from 'koa';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import logWrite from '../logger';
import routes from '../routes';
import handleErrors from '../middleware/ErrorHandler';
import { ConfigOptions, KoaEvent } from '../types';
import path from 'path';
import http, { Server as HttpServer } from 'http';
import SocketIO, { Server as SocketIoServer } from 'socket.io';
import SocketModule from '../socket';
import { SocketManager } from '../socket/manager';
import serveIndexHTML from '../middleware/serveIndexHTML';
import handleApiNotFound from '../middleware/handleApiNotFound';
import Events from '../socket/events';
import { Token } from 'shared-types';
import chalk from 'chalk';
import { ip } from '../helpers';
import { Env } from '../helpers/env';

export default class Server {
  public koa: Koa;
  public httpServer: HttpServer;
  public ioServer: SocketIoServer;
  private socketModule: SocketModule;
  private socketManager: SocketManager;
  private serverTimer: NodeJS.Timer;
  private readonly staticFolderPath: string;

  constructor(private readonly config: ConfigOptions) {
    // Makes publicly accessible React build folder
    this.staticFolderPath = path.join(__dirname, config.server.staticFolderPath);
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
          // Allow preconfigured origins and 'localhost' to path through
          if (this.config.origins.includes(ctx.headers.origin) || ctx.headers.origin.includes('localhost')) {
            return ctx.headers.origin;
          }
          throw new Error(
            `Request referer=>origin=[${ctx.request.headers.referer}]=>[${ctx.headers.origin}] rejected by CORs.` +
              ` Requests are allowed only from: ${JSON.stringify(this.config.origins, null, 2)}`,
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
    this.koa.on(KoaEvent.debug, (debugMessage) => logWrite.debug(`[debug] ${debugMessage}`));

    return this;
  }

  startServer(): Promise<HttpServer> {
    const { port, hostname, apiContextPath } = this.config.server;

    return new Promise((resolve) => {
      this.httpServer.listen(port, hostname, function () {
        if (!Env.isTest) {
          const localhost = chalk.blue(`http://127.0.0.1:${port}${apiContextPath}/v1/storage`);
          logWrite.debug(`Example API endpoint: ${localhost}`);
          if (Env.isDev) {
            const localEndpoint = chalk.blue(`http://${ip.address}:${port}`);
            logWrite.debug(`Your local endpoint: ${localEndpoint}`);
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

    this.socketModule = new SocketModule(this.ioServer, this.koa, new Events());
    this.socketManager = new SocketManager(this.ioServer);
    this.serverTimer = this.socketModule.sendUpdatesEvery(this.socketManager);

    return this.socketModule;
  }
}
