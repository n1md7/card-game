import { gameStore, Game } from "../store/index";
import BaseModel from "./BaseModel";

class GameModel extends BaseModel<Game> {
  public getGamesList() {
    return Object.values( gameStore.getStorage() )
      .map( ( game: Game ) => game.getGameData() );
  }
}

export default new GameModel( gameStore );
