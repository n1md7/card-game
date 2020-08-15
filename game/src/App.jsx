import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import { v4 as uuidv4 } from 'uuid';


import './css/app.css';

import Header from "./components/Header";
import Footer from "./components/Footer";


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import Lobby from "./components/Lobby";



function App() {

    const [auth, setAuth] = useState(false);

    useEffect(() => {
        setAuth(Cookies.get('name') !== undefined);
        console.log("effect");
    }, []);

    return (
      <div>
        <Header onAuthorise={setAuth}/>
        {!auth ? <Login onAuthorise={setAuth}/> : <Lobby/>}
        <Footer/>
      </div>
);
}

export default App;
