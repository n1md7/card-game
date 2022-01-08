import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env' });
}

import config from './config';
import Server from './server';

// Start Koa server
const koa = new Server(config);
koa.init();
koa.startServer().then(() => koa.attachSocket());
