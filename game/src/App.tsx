import React from 'react';
import Grid from './components/Grid'
import './css/app.css';
import Header from "./components/Header";
import Footer from "./components/Footer";

const testData = {
  grid: [
    {id: 111, players: 2},
    {id: 211, players: 2},
    {id: 3222, players: 2}
  ]
}


function App() {
  return (
      <>
        <Header/>
        <Grid data={testData.grid}/>
        <Footer/>
      </>
  );
}

export default App;
