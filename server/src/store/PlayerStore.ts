import BaseStore, { Storage } from './BaseStore';
import Player from '../game/Player';

export default class PlayerStore extends BaseStore<Player> {
  constructor(defaultData: Storage<Player> = {}) {
    super(defaultData);
  }

  public addPlayerById(player: Player, userId: string) {
    this.storage[userId] = player;
  }
}
