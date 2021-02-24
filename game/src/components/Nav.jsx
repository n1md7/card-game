import React from 'react';

const Nav = ({children}) => (
  <div className="container my-5">
    <div className="jumbotron">
      <h1 className="text-muted text-center">Card game</h1>
      {children}
    </div>
  </div>
);

export default Nav;