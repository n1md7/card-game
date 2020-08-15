import React from 'react';
import Grid from './components/Grid'
import './css/app.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateGame from "./components/CreateGame";
import Axios from 'axios'


import 'bootstrap/dist/css/bootstrap.min.css';

const testData = {
  grid: [
    {id: 111, name: "ass", players: 2},
    {id: 211, name: "ass", players: 2},
    {id: 322, name: "ass", players: 1},
    {id: 347, name: "ass", players: 3},
    {id: 3278, name: "ass", players: 7}
  ]
}

const joinGameUrl = 'http://localhost:8080/join-game';
const createGameUrl = 'http://localhost:8080/join-game';

function App() {

    const createGame = (options: any) => {
        Axios
            .post(createGameUrl, options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        console.log(options);
    }

    const joinGame = (gameId: string) => {
        alert(gameId);
    }

    return (
      <>
        <Header/>
        <CreateGame createGameHandler={(options: any) => {createGame(options)}}/>
        <Grid data={testData.grid} joinGameHandler={(gameId: string) => {joinGame(gameId)}}/>
        <Footer/>
      </>
);
}

export default App;
