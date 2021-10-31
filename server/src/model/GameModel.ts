import '../helpers/index';
import Player from '../game/Player';
import Game from '../game/Game';
import BaseModel from './BaseModel';
import { gameStore, playerStore, userStore } from '../store';

class GameModel extends BaseModel<Game> {
  public getGamesList() {
    return Object.values(gameStore.getStorage())
      .map((game) => game.details)
      .filter((game) => game.isPublic === true);
  }

  public join(id: string, userId: string, name: string): Game {
    const game = gameStore.getById(id);
    if (!game) {
      throw new Error(`could not find a room to join with the id:${id}`);
    }
    const user = userStore.getById(userId);
    if (!user) {
      throw new Error(`could not find a user with the id:${userId}`);
    }

    if (game.playerAlreadyInGameRoom(user)) {
      return game;
    }

    if (game.isStarted) {
      throw new Error(`this game is already started`);
    }

    const player = new Player(user.id, name || user.name);
    game.joinPlayer(player);
    playerStore.setById(player.id, player);
    userStore.setGameId(userId, game.id);

    return game;
  }

  public leave(userId: string) {
    const user = playerStore.getById(userId);
    if (!user) {
      throw new Error(`could not find a user with the id:${userId}`);
    }
    const game = user.game;
    if (!game) {
      throw new Error(`could not find a room to remove`);
    }

    game.removePlayerFromTheGame(userId);
    // remove gameId from User
    userStore.setGameId(userId, null);
  }

  public create(userId: string, player: Player, game: Game): void {
    playerStore.setById(player.id, player);
    gameStore.setById(game.id, game);
    userStore.setGameId(userId, game.id);
  }
}

export default new GameModel(gameStore);
