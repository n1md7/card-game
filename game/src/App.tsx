import React from 'react';
import Grid from './components/Grid'
import './css/app.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

const testData = {
  grid: [
    {id: 111, players: 2},
    {id: 211, players: 2},
    {id: 322, players: 1},
    {id: 347, players: 3},
    {id: 3278, players: 7}
  ]
}

function App() {
  return (
      <>
        <Header/>
        <Grid data={testData.grid} filters={Object.fromEntries(Object.keys(testData.grid[0]).map(a => [a, '']))}/>
        <Footer/>
      </>
  );
}

export default App;
