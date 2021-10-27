import Player from '../game/Player';
import UserModel from '../model/UserModel';
import SocketIO from 'socket.io';

export default class SocketManager {
  private io: SocketIO.Server;

  constructor(io: SocketIO.Server) {
    this.io = io;
  }

  public sendMessage(player: Player, event: string, args: any) {
    const user = UserModel.getById(player.id);
    this.io.to(user.socketId).emit(event, args);
  }
}
