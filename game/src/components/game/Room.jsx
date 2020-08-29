import React, { useEffect, useRef } from "react";
import "../../css/game.scss";
import Card from "../cards/Card";
export default () => {

  return (
    <div className="x-room-table">
      <div className="x-player-bar">
        <div className="x-cards">
          <Card className={'x-card'}/>
          <Card rank={'ace'} suit={'hearts'}/>
          <Card rank={'queen'} suit={'hearts'}/>
          <Card rank={'10'} suit={'hearts'}/>
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card rank={'king'} suit={'diamonds'}/>
          <Card rank={'3'} suit={'diamonds'}/>
          <Card rank={'queen'} suit={'diamonds'}/>
          <Card rank={'10'} suit={'diamonds'}/>
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card rank={'7'} suit={'spades'}/>
          <Card rank={'2'} suit={'spades'}/>
          <Card rank={'9'} suit={'spades'}/>
          <Card rank={'10'} suit={'spades'}/>
        </div>
      </div>
      <div className="x-player-bar">
        <div className="x-cards">
          <Card rank={'jack'} suit={'clubs'}/>
          <Card rank={'4'} suit={'clubs'}/>
          <Card rank={'8'} suit={'clubs'}/>
          <Card rank={'10'} suit={'clubs'}/>
        </div>
      </div>
    </div>
  );
};