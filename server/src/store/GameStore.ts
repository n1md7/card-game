import BaseStore, { Storage } from "./BaseStore";
import Game from "../game/Game";

export default class GameStore extends BaseStore<Game> {
  constructor( defaultData: Storage<Game> = {} ) {
    super( defaultData );
  }
}
