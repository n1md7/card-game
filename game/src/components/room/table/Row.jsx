import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import ajax from "axios";
import { urls } from "../../../constants/urls";
import { updateUser } from "../../../redux/actions";

export default function Row( { id, creator, inRoomSize, size } ) {
  const dispatch = useDispatch();
  const { name } = useSelector( ( { user } ) => user );
  const [ joinText, setJoinText ] = useState( "Join" );
  // bind user id to access using this keyword
  // and dispatch to redux user store and update
  const joinClickHandler = function () {
    setJoinText( "Joining..." );
    const { id, name } = this;
    ajax.post( urls.join_room, {
        id, name
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
        // just 1s delay
        setTimeout( () => {
          setJoinText( "Join" )
        }, 1000 );
        // todo log this
        // hmm again too bad
        console.warn( error );
      } );

  }.bind( {
    id, name
  } );

  return (
    <tr>
      <td>{ id }</td>
      <td>{ creator.name }</td>
      <td>{ inRoomSize }/{ size }</td>
      <td>
        <button
          onClick={ joinClickHandler }
          data-id={ id }
          className="btn btn-sm btn-outline-secondary">
          { joinText }
        </button>
      </td>
    </tr>
  );
};
