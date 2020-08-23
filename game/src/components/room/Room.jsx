import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/actions";
import ajax from "axios";
import { urls } from "../../constants/urls";

// id is prop passed from Lobby
// when redirect happens prop id is null
export default function Room( { id } ) {
  // roomId is URL route param
  const user = useSelector( ( { user } ) => user );
  const { roomId } = useParams();
  const dispatch = useDispatch();

  useEffect( () => {
    // when accessed directly from the URL
    // we dont know that roomId definitely exists
    // or the user is able to join the table
    if ( !id ) {
      ajax.post( urls.join_room, {
          id: roomId, name: user.name
        } )
        .then( ( { data } ) => data )
        .then( ( { ok, room, msg } ) => {
          if ( !ok || !room ) {
            // todo log error
            // hmm that's bad
            throw new Error( msg );
          }

          return room.id;
        } )
        // trigger redux user store object update
        // which will be caught from the component Lobby
        .then( roomId => dispatch( updateUser( { roomId } ) ) )
        .catch( error => {
          // error on non valid roomId
          // so reset it
          dispatch( updateUser( { roomId: null } ) )
          console.warn( error );
        } );
    }
  }, [] );

  return user.roomId ? (
    <div>This is your game room #{ user.roomId }</div>
  ) : (
    <h3 className="text-center">
      Requested room ID: { user.roomId } does not exist or
      you are not allowed to join here!
    </h3>
  )
}
