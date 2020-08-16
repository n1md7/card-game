import React from 'react';
import Axios from 'axios'

import Grid from './Grid'
import CreateGame from "./CreateGame";

import 'bootstrap/dist/css/bootstrap.min.css';
import './../css/app.css';


import {urls} from "../constants/urls.js"


const testData = {
    grid: [
        {id: 111, name: "ass", players: 2},
        {id: 211, name: "ass", players: 2},
        {id: 322, name: "ass", players: 1},
        {id: 347, name: "ass", players: 3},
        {id: 3278, name: "ass", players: 7}
    ]
}


function Lobby() {
    const createGame = (options) => {
        Axios
            .post(urls.create_room, options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        console.log(options);
    }

    const joinGame = (gameId) => {
        alert(gameId);
    }

    return (
        <>
            <CreateGame createGameHandler={createGame}/>
            <Grid data={testData.grid} joinGameHandler={joinGame}/>
        </>
    );
}

export default Lobby;
