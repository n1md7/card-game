import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import {v4 as uuidv4} from 'uuid';


import './css/app.css';

import Header from "./components/Header";
import Footer from "./components/Footer";


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import Lobby from "./components/Lobby";


function App() {

    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState('');

    const logOut = () => {
        // remove cookie value
        Cookies.set('name', '');
        // reset user and trigger update
        setUser('');
        setAuth(false);
    }

    useEffect(() => {
        // get cookie value
        const name = Cookies.get('name');
        // update User state with boolean values
        setUser(name);
        setAuth(!!name);
        // and do this every auth state change
    }, [auth]);

    return (
        <div>
            {
                auth ? (
                    <>
                        <Header
                            user={user}
                            logOut={logOut}
                        />
                        <Lobby/>
                    </>
                ) :
                <Login setAuth={setAuth}/>
            }
            <Footer/>
        </div>
    );
}

export default App;
