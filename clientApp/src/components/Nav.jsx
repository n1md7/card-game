import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ children }) => (
  <div className="container my-5">
    <div className="jumbotron">
      <h1 className="text-muted text-center">
        <Link to={'/'}>Card game</Link>
      </h1>
      {children}
    </div>
  </div>
);

export default Nav;
