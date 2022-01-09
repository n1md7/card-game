import SocketIO, { Socket } from 'socket.io';
import { isset, not } from '../helpers';
import { ErrorType, JWTProps, KoaEvent } from '../types';
import { Token } from 'shared-types';
import Events from './events';
import jsonWebToken from 'jsonwebtoken';
import PlayerModel from '../model/PlayerModel';
import GameModel from '../model/GameModel';
import Koa from 'koa';
import { SocketManager } from './manager';
import ms from 'ms';
import { gameStore, playerStore } from '../store';

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
        const game = GameModel.getById(player.gameId);
        if (!isset(game)) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`We couldn't find a game with the id:${player.gameId}`);
        }
        socket.join(game.id);
        this.koa.emit(KoaEvent.debug, `Socket room created`);
        this.koa.emit(KoaEvent.debug, `Player ${player.name} connected`);
        // One every new connection update player socket ID
        player.socketId = socket.id;
        PlayerModel.setById(player.id, player);
        game.updatePlayer(player);
        if (game.isFinished) {
          this.koa.emit(KoaEvent.debug, `Game ${game.id} is finished`);
          this.io.in(game.id).emit('full-game-finished', game.results, game.winner);
          this.io.in(game.id).emit('game:round-results', game.roundResults);
          this.io.in(game.id).emit('game:results', game.results, game.winner);
        } else {
          game.emitInitialData();
          // Listen and process client request on "player:move"
          socket.on('player:move', this.events.playerMove(player, this.io, game));
        }
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
        this.koa.emit(KoaEvent.socketError, error.message);
      }
    });

    this.io.on('error', (message: string) => {
      this.io.emit('error', message);
      this.koa.emit(KoaEvent.socketError, message);
    });
  }

  public sendUpdatesEvery = (socketManager: SocketManager, milliseconds = 500) =>
    setInterval(() => {
      for (const gid in GameModel.games) {
        if (GameModel.games.hasOwnProperty(gid)) {
          const game = GameModel.games[gid];
          if (!game || !game.players) continue;

          game.ticker((tick, delta) => {
            if (tick) {
              if (game.isStarted && !game.isFinished && !game.idle) {
                if (game.playerTime <= 0) {
                  game.forceActivePlayerToPlaceRandomCard();
                }
              }

              if (game.idle && !game.isFinished) {
                if (game.idleTime <= 0) {
                  game.startNewRound();
                } else {
                  game.idleTime--;
                }
              }

              if (game.isFinished) {
                game.sendGameResults();

                // Clean up finished games
                if (Date.now() - game.finishedAt >= ms('5m')) {
                  game.players.forEach((player) => playerStore.removeById(player.id));
                  gameStore.removeById(game.id);
                }
              }
            }
          });
        }
      }
    }, milliseconds);
}
