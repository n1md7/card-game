import SocketIO, { Socket } from 'socket.io';
import UserModel from '../model/UserModel';
import { isset } from '../helpers/extras';
import { JWTProps, KoaEvent, Token } from '../types';
import Events from './events';
import jsonWebToken from 'jsonwebtoken';
import PlayerModel from '../model/PlayerModel';
import GameModel from '../model/GameModel';
import Koa from 'koa';

export default class SocketModule {
  constructor(private readonly io: SocketIO.Server, private readonly koa: Koa, private readonly events: Events) {}

  public connectionHandler(): void {
    this.io.on('connection', (socket: Socket) => {
      try {
        const verified = jsonWebToken.verify(socket.handshake.query['token'], process.env.JWT_SECRET);
        const userId = (verified as JWTProps)[Token.userId];
        const user = UserModel.getById(userId);
        if (!isset(user)) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`We couldn't find a user with the id:${userId}`);
        }
        user.socketId = socket.id;
        socket.on('player:move', this.events.playerMove(user));
      } catch ({ message }) {
        this.io.to(socket.id).emit('error', message);
      }
    });

    this.io.on('error', (message: string) => {
      this.io.emit('error', message);
      this.koa.emit(KoaEvent.socketError, message);
    });
  }

  public sendUpdatesEvery(time = 1000) {
    return (timeInterval: 'milliseconds') => {
      return setInterval(() => {
        const users = UserModel.getUsers();
        for (const userId in users) {
          // eslint-disable-next-line no-prototype-builtins
          if (users.hasOwnProperty(userId)) {
            const user = UserModel.getById(userId);
            const player = PlayerModel.getById(user.id);
            if (player) {
              const game = GameModel.getById(player.gameId);
              if (game) {
                if (game.isFinished) {
                  this.io.to(user.socketId).emit('game:finished', game.statistics());
                } else {
                  this.io.to(user.socketId).emit('game:data', game.getGameData(player));
                  this.io.to(user.socketId).emit('player-cards', player.handCards);
                  this.io.to(user.socketId).emit('table-cards:add', game.getCardsList());
                }
              }
            }
          }
        }
      }, time);
    };
  }
}
