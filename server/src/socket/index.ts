import SocketIO, { Socket } from 'socket.io';
import UserModel from '../model/UserModel';
import { isset } from '../helpers/extras';
import { JWTProps, KoaEvent } from '../types';
import { Token } from 'shared-types';
import Events from './events';
import jsonWebToken from 'jsonwebtoken';
import PlayerModel from '../model/PlayerModel';
import GameModel from '../model/GameModel';
import Koa from 'koa';
import { ErrorType } from '../types/error';

export default class SocketModule {
  constructor(private readonly io: SocketIO.Server, private readonly koa: Koa, private readonly events: Events) {}

  public connectionHandler(): void {
    this.io.on('connection', (socket: Socket) => {
      try {
        // Extracting userId from JWT auth token and fetching it for the store
        const verified = jsonWebToken.verify(socket.handshake.query[Token.auth], process.env.JWT_SECRET);
        const userId = (verified as JWTProps)[Token.userId];
        const user = UserModel.getById(userId);
        if (!isset(user)) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`We couldn't find a user with the id:${userId}`);
        }
        // One every new connection update user socket ID
        user.socketId = socket.id;
        // Listen and process client request on "player:move"
        socket.on('player:move', this.events.playerMove(user));
      } catch (error) {
        // Socket error handling
        switch (error.name) {
          case ErrorType.gameError:
            this.io.to(socket.id).emit('game:error', error.message);
            break;
          case ErrorType.jsonWebTokenError:
            this.io.to(socket.id).emit('jwt:error', error.message);
            break;
          default:
            this.io.to(socket.id).emit('error', error.message);
        }
      }
    });

    this.io.on('error', (message: string) => {
      this.io.emit('error', message);
      this.koa.emit(KoaEvent.socketError, message);
    });
  }

  public sendUpdatesEvery(time = 1000) {
    return (timeInterval: 'milliseconds') => {
      // FIXME this looping is redundant. Only games are important to iterate not users or players
      //  only get players based on game object
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
