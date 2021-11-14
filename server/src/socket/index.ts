import SocketIO, { Socket } from 'socket.io';
import { isset, not } from '../helpers';
import { ErrorType, JWTProps, KoaEvent } from '../types';
import { Token } from 'shared-types';
import Events from './events';
import jsonWebToken from 'jsonwebtoken';
import PlayerModel from '../model/PlayerModel';
import GameModel from '../model/GameModel';
import Koa from 'koa';

export default class SocketModule {
  constructor(private readonly io: SocketIO.Server, private readonly koa: Koa, private readonly events: Events) {
    this.io.on('connection', (socket: Socket) => {
      try {
        // Extracting userId from JWT auth token and fetching it for the store
        const verified = jsonWebToken.verify(socket.handshake.query[Token.auth], process.env.JWT_SECRET);
        const playerId = (verified as JWTProps)[Token.userId];
        const player = PlayerModel.getById(playerId);
        if (!isset(player)) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`We couldn't find a player with the id:${playerId}`);
        }
        // One every new connection update player socket ID
        player.socketId = socket.id;
        // Listen and process client request on "player:move"
        socket.on('player:move', this.events.playerMove(player.id));
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

  public sendUpdatesEvery = (milliseconds = 1000) =>
    setInterval(() => {
      for (const gid in GameModel.games) {
        if (GameModel.games.hasOwnProperty(gid)) {
          const game = GameModel.games[gid];
          game.ticker((tick, delta) => {
            // if (tick) {
            // if (game.playerTime <= 0) {
            if (not(game.isFinished)) {
              game.activePlayer?.placeRandomCardFromHand();
            }
            // }
            // }
          });
          for (const player of game.players) {
            if (game.isFinished) {
              this.io.to(player.socketId).emit('game:finished', game.statistics());
            } else {
              this.io.to(player.socketId).emit('game:data', game.getGameData(player));
              this.io.to(player.socketId).emit('player-cards', player.handCards);
              this.io.to(player.socketId).emit('table-cards:add', game.cardsList);
            }
          }
        }
      }
    }, milliseconds);
}
