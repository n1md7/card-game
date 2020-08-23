import React from "react";
import Authenticate from "./components/Authenticate";
import Lobby from "./components/Lobby";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./css/app.scss";

// when user.name is not defined
// it always shows auth component
export default function App() {
  const user = useSelector( ( { user } ) => user );

  return (
    <Router>
      <div className="container my-5">
        <div className="jumbotron">
          <h1 className="text-muted text-center">Card game</h1>
          {
            !user.name ? <Authenticate/> : <Lobby/>
          }
        </div>
      </div>
    </Router>
  );
}
