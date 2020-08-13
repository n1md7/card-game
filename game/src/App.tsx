import React from 'react';
import Grid from './components/Grid'
import './css/app.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateGame from "./components/CreateGame";

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

function App() {

    const createGame = (name: string, players: number) => {
        alert(name + " " + players);
    }

    const joinGame = (gameId: string) => {
        alert(gameId);
    }

    return (
      <>
        <Header/>
        <CreateGame createGameHandler={(name: string, players: number) => {createGame(name, players)}}/>
        <Grid data={testData.grid} joinGameHandler={(gameId: string) => {joinGame(gameId)}}/>
        <Footer/>
      </>
);
}

export default App;
