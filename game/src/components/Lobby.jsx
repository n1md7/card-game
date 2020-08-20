import React, { Fragment } from "react";
import JoinRoom from "./room/Join";
import CreateRoom from "./room/Create";
import { useSelector } from "react-redux";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import EnterRoom from "./room/Room";

export default function Lobby() {
  const { roomId } = useSelector( ( { user } ) => user );

  return (
    <Fragment>
      {
        roomId ? (
          <Redirect to={ `/room/${ roomId }` }/>
        ) : (
          <ul className="nav justify-content-center my-5">
            <li className="nav-item mx-3">
              <Link className="nav-link btn btn-outline-dark btn-lg" to="/join">Join</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link btn btn-outline-primary btn-lg" to="/create">Create</Link>
            </li>
          </ul>
        )
      }

      <Switch>
        <Route path="/create">
          <CreateRoom/>
        </Route>
        <Route path="/join">
          <JoinRoom/>
        </Route>
        <Route path='/room/:roomId'>
          <EnterRoom id={ roomId }/>
        </Route>
      </Switch>
    </Fragment>
  );
}
