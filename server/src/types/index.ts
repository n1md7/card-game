import { Context } from 'koa';

export enum Token {
  self = 'token',
  userId = 'userId',
  name = 'name',
}

export enum Room {
  two = 2,
  three,
  four,
}

/**
 * @description extends {Koa} context with custom state props
 */
interface MyContext extends Context {
  state: {
    user: {
      id: string;
      name: string;
    };
  };
}

interface JWTProps {
  userId: string;
  iat: number;
  exp: number;
}

export enum Env {
  Dev = 'development',
  Test = 'test',
  Prod = 'production',
}

export enum KoaEvent {
  socketError = 'error:socket',
  serverError = 'error:server',
  debug = 'debug',
}

export { MyContext as Context, JWTProps };
