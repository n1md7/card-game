import { Context } from '../../types';

export default interface Auth {
  status: (ctx: Context) => Promise<void>;
  userVerified: (ctx: Context) => Promise<void>;
  getNewJsonWebToken: (ctx: Context) => Promise<void>;
  getInitialJsonWebToken: (ctx: Context) => Promise<void>;
}
