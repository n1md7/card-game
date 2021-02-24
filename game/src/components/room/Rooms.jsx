import React from 'react';
import Row from './table/Row';
import useRooms from '../../hooks/useRooms';

export default function Rooms(){
  const list = useRooms();

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
            list.map((values, key) => <Row key={key} {...values} />)
          }
          </tbody>
        </table>
      </div>
    </div>
  )
};
