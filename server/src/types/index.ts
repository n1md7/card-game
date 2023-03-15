export * from './config';
export * from './error';
export * from './logger';
import { Context } from 'koa';

/** @description extends {Koa} context with custom state props */
interface MyContext extends Context {
  state: {
    user: {
      id: string;
      name: string;
    };
  };
}

export { MyContext as Context };

export interface JWTProps {
  userId: string;
  iat: number;
  exp: number;
}

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  DEBUG = 'debug',
}

export enum KoaEvent {
  socketError = 'error:socket',
  serverError = 'error:server',
  debug = 'debug',
}
