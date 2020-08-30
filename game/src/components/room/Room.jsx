import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/actions";
import { ajax } from "../../services/ajax";
import { urls } from "../../constants/urls";
import { Alert, AlertType } from "../../helpers/toaster";

// id is prop passed from Lobby
// when redirect happens prop id is null
export default function Room( { id } ) {
  // roomId is URL route param
  const user = useSelector( ( { user } ) => user );
  const [ joining, setJoining ] = useState( true );
  const { roomId } = useParams();
  const dispatch = useDispatch();

  useEffect( () => {
    // when accessed directly from the URL
    // we dont know that roomId definitely exists
    // or the user is able to join the table
    if ( !id ) {
      ajax.post( urls.joinRoom, {
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
        .then( roomId => {
          dispatch( updateUser( { roomId } ) );
          setJoining( false );
        } )
        .catch( error => {
          // error on non valid roomId
          // so reset it
          dispatch( updateUser( { roomId: null } ) )
          setJoining( false );
          Alert(AlertType.ERROR, error.message, 10);
        } );
    }
  }, [] );

  return user.roomId ? (
    <div className="text-center">
      This is your game room #{ user.roomId }
    </div>
  ) : joining ? "loading..." : (
    <h3 className="text-center">
      Requested room ID: { user.roomId } does not exist or
      you are not allowed to join here!
    </h3>
  )
}
