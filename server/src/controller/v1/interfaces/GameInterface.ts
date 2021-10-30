import { Context } from '../../../types';
import { SocketManager } from '../../../socket/manager';

export default interface GameInterface {
  createGame: (ctx: Context & { socketManager: SocketManager }) => Promise<void>;
  enterGame: (ctx: Context) => Promise<void>;
  exitGame: (ctx: Context) => Promise<void>;
  getAllPublicGames: (ctx: Context) => Promise<void>;
}
