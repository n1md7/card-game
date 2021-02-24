import React from 'react';
import RoomsTableList from './Rooms';
import Header from '../Header';

export default () => (
  <Header>
    <h3 className="text-center mt-5 mb-4 text-muted">Rooms</h3>
    <RoomsTableList/>
  </Header>
);
