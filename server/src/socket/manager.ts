import Player from '../game/Player';
import UserModel from '../model/UserModel';
import SocketIO from 'socket.io';

export class SocketManager {
  constructor(private readonly io: SocketIO.Server) {}

  public sendMessage(player: Player, event: string, args: unknown): void {
    const user = UserModel.getById(player.id);
    this.io.to(user.socketId).emit(event, args);
  }
}
