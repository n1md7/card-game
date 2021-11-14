import Player from '../game/Player';
import UserModel from '../model/UserModel';
import SocketIO from 'socket.io';

type SocketId = string;
export type SocketManagerEvents = 'one-game-finished' | 'game-is-over' | 'game:take-cards';

export class SocketManager {
  private targetSocketIds: SocketId[];

  constructor(private readonly io: SocketIO.Server) {}

  private static extractSocketId(player: Player): SocketId {
    return UserModel.getById(player.id).socketId;
  }

  public emit(event: SocketManagerEvents, ...args: unknown[]): void {
    if (args[0] instanceof Player) {
      this.targetSocketIds = [SocketManager.extractSocketId(args[0])];
    }

    this.targetSocketIds.forEach((socketId: SocketId) => {
      this.io.to(socketId).emit(event, ...args);
    });
  }

  public to(player: Player | Player[]): SocketManager {
    if (player instanceof Player) {
      this.targetSocketIds = [SocketManager.extractSocketId(player)];
    } else {
      this.targetSocketIds = player.map(SocketManager.extractSocketId);
    }

    return this;
  }
}
