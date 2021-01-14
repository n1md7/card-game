import { userStore, gameStore, playerStore } from "../store";
import "../helpers/index";
import Player from "../game/Player";
import Game from "../game/Game";

class RoomModel {

  public join( id: string, userId: string, name: string ): Game {
    const game = gameStore.getById( id );
    if ( !game ) {
      throw new Error( `could not find a room to join with the id:${ id }` );
    }
    const user = userStore.getById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }

    if ( game.playerAlreadyInGameRoom( user.id ) ) {
      return game;
    }

    if ( game.isStarted ) {
      throw new Error( `this game is already started` );
    }

    const player = new Player( user.id, name || user.name );
    game.joinPlayer( player );
    playerStore.setById( player.getPlayerId(), player );
    playerStore.addPlayerById( player, userId );

    return game;
  }

  public leave( userId: string ) {
    const user = playerStore.getById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    const game = user.getGame();
    if ( !game ) {
      throw new Error( `could not find a room to remove` );
    }

    game.removePlayerFromTheGame( userId );
  }

  public create( userId: string, roomId: string, size: number, isPublic: boolean, name: string ): Player {
    const player = new Player( userId, name );
    const game = new Game( size, roomId, isPublic, userId, name );
    game.joinPlayer( player );
    playerStore.setById( player.getPlayerId(), player );
    gameStore.setById( game.getGameId(), game );

    return player;
  }

}

export default new RoomModel();