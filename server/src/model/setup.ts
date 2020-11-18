import { store } from "../store";
import "../helpers/index";
import Player from "../game/player";
import Game from "../game/game";
import User from "../user";

class Setup {

  public signIn( id: string, name?: string | null ): null | Player {
    const user = store.getPlayerById( id );
    if ( user && !name ) {

      return user;
    }

    return null;
  }

  public signUp( id: string, name: string | null ): User {
    return store.setUserById( id, new User( id, name ) );
  }

  public createRoom( userId: string, roomId: string, size: number, isPublic: boolean, name: string ): Player {
    const player = new Player( userId, name );
    const game = new Game( size, roomId, isPublic, userId, name );
    game.joinPlayer( player );
    store.setPlayerById( player.getPlayerId(), player );
    store.setGameById( game.getGameId(), game );

    return player;
  }

  public joinRoom( id: string, userId: string, name: string ): Game {
    const game = store.getGameById( id );
    if ( !game ) {
      throw new Error( `could not find a room to join with the id:${ id }` );
    }
    const user = store.getUserById( userId );
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
    store.setPlayerById( player.getPlayerId(), player );
    store.addPlayerToken( player, userId );

    return game;
  }

  public leaveRoom( userId: string ) {
    const user = store.getPlayerById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    const gameId = user.getGameId();
    const game = user.getGame();
    if ( !game ) {
      throw new Error( `could not find a room to remove` );
    }

    game.removePlayerFromTheGame( userId );
  }

  public getUserInfo( userId: string ) {
    const user = store.getUserById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }

    return user;
  }

}

export default new Setup();
