import React, { useEffect, useState } from "react";
import { ajax } from "../../services/ajax";
import { urls } from "../../constants/urls";
import Row from "./table/Row";
import { Alert, AlertType } from "../../helpers/toaster";

export default function Rooms() {
  const [ list, setList ] = useState( [] );
  useEffect( () => {
    const updateRoomsList = () => {
      ajax
        .get( urls.showRooms )
        .then( ( { data } ) => data )
        .then( ( { ok, rooms, msg } ) => {
          if ( !ok ) {
            // hmm that's bad
            throw new Error(msg);
          }

          return Object.entries( rooms );
        } )
        .then( setList )
        .catch( error => {
          Alert(AlertType.ERROR, error.message, 10);
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
            list.map( ( [ key, values ] ) => <Row key={ key } { ...values } /> )
          }
          </tbody>
        </table>
      </div>
    </div>
  )
};
