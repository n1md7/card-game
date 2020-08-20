import React, { useEffect, useState } from "react";
import ajax from "axios";
import { urls } from "../../constants/urls";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/actions";

const Rooms = () => {
  const [ list, setList ] = useState( [] );
  useEffect( () => {
    const updateRoomsList = () => {
      ajax
        .get( urls.show_rooms )
        .then( ( { data } ) => data )
        .then( ( { ok, rooms } ) => {
          if ( !ok ) {
            // todo log error
            // hmm that's bad
            return [];
          }

          return Object.entries( rooms );
        } )
        .then( setList )
        .catch( error => {
          // todo log this
          // hmm again too bad
          setList( [] );
        } );
    };

    // trigger first load
    updateRoomsList();
    // set up ticker for every 1s update
    const interval = setInterval( updateRoomsList, 1000 );
    // clean up function
    return () => clearInterval( interval );
  }, [] );

  return (
    <div className="row justify-content-center">
      <div className="col-12 text-center">
        <table className="table table-sm table-hover">
          <thead>
          <tr>
            <td>ID</td>
            <td>Creator</td>
            <td>Players</td>
            <td>Action</td>
          </tr>
          </thead>
          <tbody>
          {
            list.map( ( [ key, values ] ) => <RoomRow key={ key } { ...values } /> )
          }
          </tbody>
        </table>
      </div>
    </div>
  )
};


const RoomRow = ( { id, creator, inRoomSize, size } ) => {
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

export default Rooms;
