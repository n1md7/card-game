import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import {v4 as uuidv4} from 'uuid';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';

import Header from "./components/Header";
import Footer from "./components/Footer";


import Login from "./components/Login";
import Lobby from "./components/Lobby";
import Axios from "axios";
import {urls} from "./constants/urls";


function App() {

    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState('');

    const logOut = () => {
        Axios
            .get(urls.log_out)
            .then((res) => {
                Cookies.remove('user');
                setUser('');
                setAuth(false);
            })
            .catch((err) => {
                console.log(err);
            });

    }

    useEffect(() => {
        // get cookie value
        const userCookie = Cookies.get('user');
        if (userCookie !== undefined) {
            const user = JSON.parse(userCookie);
            // update User state with boolean values
            setUser(user.name);
            setAuth(!!user.name);
        } else {
            Axios
                .get(urls.user_info)
                .then((res) => {
                    const user = res.data.user;
                    if(user !== undefined) {
                        Cookies.set("user", user);
                        setUser(user);
                        setAuth(!!user);
                    }
                })
                .catch((err) => {

                });
        }

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
