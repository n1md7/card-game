import React from "react";
import Authenticate from "./components/authenticate";
import Lobby from "./components/Lobby";
import {useSelector} from "react-redux";
import './css/app.scss';

function App() {
    const user = useSelector(({user}) => user);

    return (
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="text-muted text-center">Card game</h1>
                {
                    !user.name ? <Authenticate/> : <Lobby/>
                }
            </div>
        </div>
    );
}

export default App;
