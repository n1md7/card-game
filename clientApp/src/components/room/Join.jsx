import React from 'react';
import Header from '../Header';
import Row from './table/Row';
import useRooms from '../../hooks/useRooms';

export default () => {
  const rooms = useRooms();

  return (
    <Header>
      <h3 className="text-center mt-5 mb-4 text-muted">{!rooms.length ? 'No active rooms' : 'Rooms'}</h3>
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          {!rooms.length || (
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Creator</td>
                  <td>CreatedAt</td>
                  <td>Players</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {rooms.map((values, key) => (
                  <Row key={key} {...values} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Header>
  );
};
