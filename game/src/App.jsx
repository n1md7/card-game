import React, { useEffect, useState } from "react";
import Authenticate from "./components/Authenticate";
import Lobby from "./components/Lobby";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { httpClient } from "./services/httpClient";
import { urls, baseURL, token as tokenKey } from "./constants/urls";
import { tokenStore } from "./services/token";
import { Alert, AlertType } from "./helpers/toaster";
import GameRoom from "./components/game/Room";
import { ToastContainer } from "react-toastify";

// when user.name is not defined
// it always shows auth component
export default function App() {
  const user = useSelector( ( { user } ) => user );
  const [ tokenIsSet, setTokenIsSet ] = useState( false );
  useEffect( () => {
    // get permanent token from the local storage
    const token = localStorage.getItem( tokenKey );
    // update token store which will trigger
    // ajax config update and set the headers
    tokenStore.setToken( token );
    // check whether or not our token is valid
    httpClient.get( baseURL + urls.statusCheck )
      .then( ( { data } ) => data )
      .then( ( { ok, msg } ) => {
        if ( !ok ) {
          // jwt not valid or not set
          // so need new init request
          throw new Error( msg );
        }
        // its all good, prev token is valid
        // we can continue without init request
        // update token state to tell component to move forward
        setTokenIsSet( true );
      } ).catch( () => {
      httpClient
        .get( baseURL + urls.init )
        .then( ( { data } ) => data )
        .then( ( { ok, token, msg } ) => {
          if ( !ok ) {
            // hmm that's bad
            throw new Error( msg );
          }

          // update token state
          setTokenIsSet( true );
          // custom store for the token
          tokenStore.setToken( token );
          // save it into permanent storage
          localStorage.setItem( tokenKey, token );
        } )
        .catch( ( { message } ) => {
          Alert( AlertType.ERROR, message, 10 );
        } );
    } )
  }, [] );


  /*return <GameRoom/>*/

  return (
    <Router>
      {
        !tokenIsSet ? "loading..." : (
          !user.name ? <Authenticate/> : <Lobby/>
        )
      }
      <ToastContainer/>
    </Router>
  );
}
