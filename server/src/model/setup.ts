import { store} from "../store";
import "../helpers/index";
import Player from "../game/player";
import Game from "../game/game";

class Setup {

  public signIn( id: string, name?: string | null ): null | Player {
    const user = store.getPlayerById( id );
    if ( user && !name ) {
      return user;
    }

    return null;
  }

  public signUp( id: string, name: string | null ): Player {
    return new Player("");
  }

  public createRoom( { userId, roomId, size, isPublic }: {
    userId: string;
    roomId: string;
    size: number;
    isPublic: boolean;
  } ): Game | Error {
    const newPlayer = new Player("");
    const game = new Game();
    game.joinPlayer(newPlayer)
    store.setPlayerById(newPlayer.getPlayerId(), newPlayer);
    return store.setGameById(game.getGameId(), game);
  }

  public joinRoom( { id, userId }: {
    id: string;
    userId: string;
  } ): Game | Error {
    const game = store.getGameById( id );
    // when no such room instantly throw an error
    if ( !game ) {
      throw new Error( `could not find a room to join with the id:${ id }` );
    }
    // get all joined user ids from that room
    const players = game.getPlayers();
    // get user info
    const player = store.getPlayerById( userId );
    // when user id is not valid throw an error
    if ( !player ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    /*// return room since the one is already joined
    if ( players?.length && players.includes( userId ) ) {
      return room;
    }
    // increment room size
    if ( 1 + room.inRoomSize > room.size ) {
      throw new Error( 'the room is full' );
    }

    if ( user.roomId ) {
      throw new Error( `you need to leave the table first with the id:${ user.roomId }` );
    }*/

    const newPlayer = new Player("");
    game.joinPlayer(newPlayer);
    store.setPlayerById(newPlayer.getPlayerId(), newPlayer)
    // update room store
    return game;
  }

  public leaveRoom( userId: string ) {
    /*const user = store.getPlayerById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    const { roomId } = user;
    const room = store.getGameById( roomId );
    if ( !room ) {
      throw new Error( `could not find a room to remove` );
    }

    // kick out a user from the room
    room.users.remove( userId );
    store.updateRoomById( roomId, {
      users: room.users,
      inRoomSize: room.inRoomSize - 1
    } );
    // remove from user object as well
    store.updateUserById( userId, {
      roomId: null
    } );*/
  }

  public getUserInfo( userId: string ) {
    const user = store.getPlayerById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    return user;
  }

}

export default new Setup();
