import { Context } from '../../../types';

export default interface Game {
  createGame: (ctx: Context) => Promise<void>;
  enterGame: (ctx: Context) => Promise<void>;
  exitGame: (ctx: Context) => Promise<void>;
  getAllPublicGames: (ctx: Context) => Promise<void>;
}
