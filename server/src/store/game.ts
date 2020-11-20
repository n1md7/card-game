import BaseStore, { Storage } from "./baseStore";
import Game from "../game/game";

export default class GameStore extends BaseStore<Game> {
  constructor( defaultData: Storage<Game> = {} ) {
    super( defaultData );
  }
}
