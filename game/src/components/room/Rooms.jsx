import React, { useEffect, useState } from "react";
import ajax from "axios";
import { urls } from "../../constants/urls";
import Row from "./table/Row";

export default function Rooms() {
  const [ list, setList ] = useState( [] );
  useEffect( () => {
    const updateRoomsList = () => {
      ajax
        .get( urls.show_rooms )
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
          // todo add error handling to show to user nicely
          console.log(error);
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
