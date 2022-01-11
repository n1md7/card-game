import Player from '../game/Player';
import SocketIO from 'socket.io';
import { GameEvents } from 'shared-types';

type SocketId = string;

export class SocketManager {
  private targetSocketIds: SocketId[];

  constructor(private readonly io: SocketIO.Server) {}

  get originalIO() {
    return this.io;
  }

  private static extractSocketId(player: Player): SocketId {
    if (!player || !player.socketId) {
      return;
    }
    return player.socketId;
  }

  public emit(event: GameEvents, ...args: unknown[]): void {
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
