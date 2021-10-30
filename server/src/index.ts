import dotenv from 'dotenv';

dotenv.config();

import config from './config';
import Server from './server';
// import {CardRank} from 'shared-types';
// console.log(CardRank)

// Start Koa server
const koa = new Server(config);
koa.init();
koa.startServer().then(() => koa.attachSocket());
