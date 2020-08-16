import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import { v4 as uuidv4 } from 'uuid';


import './css/app.css';

import Header from "./components/Header";
import Footer from "./components/Footer";


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import Lobby from "./components/Lobby";


const base_url = "http://localhost:81/";

const urls = {
    auth: ```${base_url}authenticate/```,
    status_check: ```${base_url}status-check/```,
    create_room: ```${base_url}create-room/```,
    show_rooms: ```${base_url}show-rooms/```,
    join_room: ```${base_url}join-room/```,
    leave_room: ```${base_url}leave-room/```
}


function App() {

    const [auth, setAuth] = useState(false);

    useEffect(() => {
        setAuth(Cookies.get('name') !== undefined);
        console.log("effect");
    }, []);

    return (
      <div>
        <Header onAuthorise={setAuth}/>
        {!auth ? <Login onAuthorise={setAuth} urls={urls}/> : <Lobby/>}
        <Footer/>
      </div>
);
}

export default App;
