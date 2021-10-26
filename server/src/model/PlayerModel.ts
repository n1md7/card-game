import { playerStore, Player } from '../store/index';
import BaseModel from './BaseModel';

class PlayerModel extends BaseModel<Player> {
  public addPlayer(player: Player, userId: string) {
    playerStore.addPlayerById(player, userId);
  }
}

export default new PlayerModel(playerStore);
