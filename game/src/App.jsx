import React, { useEffect } from "react";
import Authenticate from "./components/Authenticate";
import Lobby from "./components/Lobby";
import { BrowserRouter as Router } from "react-router-dom";
import useAuth from "./hooks/useAuth";

export default function App() {
  const [ isAuth, isLoading ] = useAuth();

  if ( isLoading ) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <Router>
      {
        isAuth ? <Lobby/> : <Authenticate/>
      }
    </Router>
  );
}
