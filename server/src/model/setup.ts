import { store, RoomProps, UserProps } from "../store";
import "../helpers/index";

class Setup {

  public signIn( id: string, name?: string | null ): null | UserProps {
    const user = store.getUserById( id );
    if ( user && !name ) {
      return user;
    }

    if ( user ) {
      return store.updateUserById( id, {
        updateTime: new Date().valueOf(),
        name
      } );

    }
    return null;
  }

  public signUp( id: string, name: string | null ): UserProps {
    return store.setUserById( id, {
      name
    } );
  }

  public updateUserById( id: string, name: string ): UserProps {
    return store.updateUserById( id, {
      updateTime: new Date().valueOf(),
      name
    } );
  }

  public createRoom( { userId, roomId, size, isPublic }: {
    userId: string;
    roomId: string;
    size: number;
    isPublic: boolean;
  } ): RoomProps | Error {
    const creator = store.getUserById( userId );
    if ( !creator ) {
      throw new Error( `no such user with the id:${ userId }` );
    }

    const room = store.getRoomById( roomId );
    if ( room ) {
      // this will happen only when ned rnd id will match roomId in db
      // such room already exists
      throw new Error( `you cannot re-create existing room: ${ room.id }` );
    }

    if ( creator.roomId ) {
      throw new Error( `you need to leave the current room first with the id:${ creator.roomId }` );
    }

    store.updateUserById( userId, {
      roomId
    } );

    return store.setRoomById( roomId, {
      creator: {
        id: creator.id,
        name: creator.name
      },
      name: creator.name,
      users: [ userId ],
      size,
      isPublic
    } );
  }

  public joinRoom( { id, userId }: {
    id: string;
    userId: string;
  } ): RoomProps | Error {
    const room = store.getRoomById( id );
    // when no such room instantly throw an error
    if ( !room ) {
      throw new Error( `could not find a room to join with the id:${ id }` );
    }
    // get all joined user ids from that room
    const { users } = room;
    // get user info
    const user = store.getUserById( userId );
    // when user id is not valid throw an error
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    // return room since the one is already joined
    if ( users?.length && users.includes( userId ) ) {
      return room;
    }
    // increment room size
    if ( 1 + room.inRoomSize > room.size ) {
      throw new Error( 'the room is full' );
    }

    if ( user.roomId ) {
      throw new Error( `you need to leave the table first with the id:${ user.roomId }` );
    }

    // update user store
    store.updateUserById( userId, {
      roomId: id
    } );
    // update room store
    return store.updateRoomById( id, {
      users: [ ...room.users, userId ],
      inRoomSize: 1 + room.inRoomSize
    } );
  }

  public leaveRoom( userId: string ) {
    const user = store.getUserById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }
    const { roomId } = user;
    const room = store.getRoomById( roomId );
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
    } );
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
