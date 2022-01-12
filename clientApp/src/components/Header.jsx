import React from 'react';
import Nav from './Nav';
import { Link } from 'react-router-dom';

const Header = ({ children }) => (
  <Nav>
    <ul className="nav justify-content-center my-5 row">
      <li className="nav-item col-md-2 mb-md-0 mb-2">
        <Link className="nav-link btn btn-outline-dark btn-lg" to="/join">
          Join
        </Link>
      </li>
      <li className="nav-item col-md-2">
        <Link className="nav-link btn btn-outline-primary btn-lg" to="/create">
          Create
        </Link>
      </li>
    </ul>
    {children}
  </Nav>
);

export default Header;
