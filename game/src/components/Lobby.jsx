import React, { Fragment, useEffect, useState } from "react";
import JoinRoom from "./room/Join";
import CreateRoom from "./room/Create";
import { useSelector } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import EnterRoom from "./room/Room";
import { ajax } from "../services/ajax";
import { urls } from "../constants/urls";
import ResumeRoom from "./room/Resume";

import {Alert, AlertType} from "../helpers/toaster"

export default function Lobby() {
  // roomId and GameId are more or less the same things
  // watches dynamic updates from different components
  // when changes redirects to Room
  const { roomId } = useSelector( ( { user } ) => user );
  // Button hide/unhide
  const [ resume, setResume ] = useState( false );
  // roomId for Resume component
  const [ id, setId ] = useState( '' );

  useEffect( () => {
    // check whether user has already in the room
    // if positive result then show Resume button
    ajax.get( urls.userInfo )
      .then( ( { data } ) => data )
      .then( ( { ok, user, msg } ) => {
        if ( !ok || !user ) {
          throw new Error( msg );
        }
        return user?.player?.gameId;
      } )
      // trigger redux user store object update
      // which will be caught then re directed
      .then( gameId => {
        if ( !gameId ) return;
        setResume( true );
        // update state to show Resume button
        // changes will be triggered when Resume component does
        setId( gameId );
      } )
      .catch( error => {
        Alert(AlertType.ERROR, error.message, 10);
        console.warn( error );
      } );
  }, [] );

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
            {
              resume && (
                <li className="nav-item mx-3">
                  <Link className="nav-link btn btn-outline-success btn-lg" to="/resume">Resume</Link>
                </li>
              )
            }
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
        <Route path="/resume">
          <ResumeRoom id={ id }/>
        </Route>
        <Route path='/room/:roomId'>
          <EnterRoom id={ roomId }/>
        </Route>
      </Switch>
    </Fragment>
  );
}
