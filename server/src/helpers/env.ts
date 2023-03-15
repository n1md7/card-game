import { NodeEnv } from '../types';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export class Env {
  public static get NodeEnv(): NodeEnv {
    const env = String(process.env.NODE_ENV).trim() as NodeEnv;
    if (!env) throw new TypeError('NODE_ENV is not defined');

    return env;
  }

  public static get isDev() {
    return Env.NodeEnv === NodeEnv.DEVELOPMENT;
  }

  public static get isProd() {
    return Env.NodeEnv === NodeEnv.PRODUCTION;
  }

  public static get isTest() {
    return Env.NodeEnv === NodeEnv.TEST;
  }
}
