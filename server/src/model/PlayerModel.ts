import { playerStore } from '../store';
import BaseModel from './BaseModel';
import Player from '../game/Player';

class PlayerModel extends BaseModel<Player> {
  public addPlayer(player: Player, userId: string) {
    playerStore.addPlayerById(player, userId);
  }
}

export default new PlayerModel(playerStore);
