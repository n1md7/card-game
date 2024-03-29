import config from './config';
import Server from './server';

// Start Koa server
const koa = new Server(config);
koa.init();
koa.startServer().then(() => koa.attachSocket());
