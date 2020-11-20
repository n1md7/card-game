import BaseStore, { Storage } from "./baseStore";
import Player from "../game/player";

export default class PlayerStore extends BaseStore<Player> {
  constructor( defaultData: Storage<Player> = {} ) {
    super( defaultData );
  }

  public addPlayerById( player: Player, userId: string ) {
    this.storage[ userId ] = player;
  }
}
