import { Context } from 'koa';

interface SocketCallback {
  message: any;
}

type RoomSizeProps = 2 | 3 | 4;

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

export { RoomSizeProps, SocketCallback, MyContext as Context, JWTProps };
