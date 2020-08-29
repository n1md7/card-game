import React, { useEffect, useRef } from "react";
import "../../css/game.scss";
import Card from "../cards/Card";


export default () => {
  useEffect( () => {
  }, [] )


  return (
    <div className="x-room-table">
      <div className="x-player-bar">
        <div className="x-cards">
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card/>
          <Card className={ "x-animate" } svg={ true } rank={ "ace" } suit={ "hearts" }/>
          <Card svg={ true } rank={ "4" } suit={ "clubs" }/>
          <Card svg={ true } rank={ "queen" } suit={ "hearts" }/>
          <Card svg={ true } rank={ "10" } suit={ "hearts" }/>
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card svg={ true } rank={ "king" } suit={ "diamonds" }/>
          <Card svg={ true } rank={ "3" } suit={ "diamonds" }/>
          <Card svg={ true } rank={ "queen" } suit={ "diamonds" }/>
          <Card svg={ true } rank={ "10" } suit={ "diamonds" }/>
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card svg={ true } rank={ "7" } suit={ "spades" }/>
          <Card svg={ true } rank={ "2" } suit={ "spades" }/>
          <Card svg={ true } rank={ "9" } suit={ "spades" }/>
          <Card svg={ true } rank={ "10" } suit={ "spades" }/>
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card rank={ "jack" } suit={ "clubs" }/>
          <Card rank={ "4" } suit={ "clubs" }/>
          <Card rank={ "8" } suit={ "clubs" }/>
          <Card rank={ "10" } suit={ "clubs" }/>
        </div>
      </div>
    </div>
  );
};