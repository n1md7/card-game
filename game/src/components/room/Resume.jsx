import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajax } from "../../services/ajax";
import { urls } from "../../constants/urls";
import { updateUser } from "../../redux/actions";

export default ( { id } ) => {
  const dispatch = useDispatch();
  const { name } = useSelector( ( { user } ) => user );

  useEffect( () => {
    // dispatch redux user store and update
    ajax.post( urls.joinRoom, {
        id, name
      } )
      .then( ( { data } ) => data )
      .then( ( { ok, room, msg } ) => {
        if ( !ok || !room ) {
          throw new Error( msg );
        }

        return room.id;
      } )
      // trigger redux user store object update
      // which will be caught from the component Lobby
      .then( roomId => dispatch( updateUser( { roomId } ) ) )
      .catch( error => {
        // todo log this
        // hmm again too bad
        console.warn( error );
      } );
  }, [] );

  return (
    <span>Joining...</span>
  );
};
