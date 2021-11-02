import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../../css/game.scss';
import { httpClient } from '../../services/httpClient';
import { useHistory } from 'react-router';
import defaultsValue from '../../constants/defaults';
import Ellipse, { Pythagoras } from '../../libs/Formulas';
import Game from '../../game/Game';
import socketIOClient, { Socket } from 'socket.io-client';
import { SOCKET_ENDPOINT } from '../../constants/urls';
import { Alert, AlertType } from '../../helpers/toaster';
import Player from './Player';
import { Token } from 'shared-types';

export default () => {
  const history = useHistory();
  const [defaults, setDefaults] = useState(defaultsValue);
  const [cardHeight, setCardHeight] = useState(defaults.cardHeight);
  const [cardWidth, setCardWidth] = useState(defaults.cardWidth);
  const [cardDiagonal, setCardDiagonal] = useState(defaults.cardDiagonal);
  // const [outerEllipse, setOuterEllipse] = useState();
  const [tableWidth, setTableWidth] = useState(defaults.tableWidth);
  const [tableHeight, setTableHeight] = useState(defaults.tableHeight);
  const [windowWidth, setWindowWidth] = useState(defaults.windowWidth);
  const [gameData, setGameData] = useState({
    playerData: {},
    remainedCards: null,
  });
  const posMap = {
    left: 'x-one',
    up: 'x-two',
    right: 'x-three',
    down: 'x-four',
  };

  useEffect(() => {
    setCardDiagonal(Pythagoras(cardHeight, cardWidth));
  }, [cardWidth, cardHeight]);

  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
    }

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const exitRoomHandler = () => {
    httpClient.put('/v1/game/exit').then(() => {
      history.push('/join');
    });
  };

  useLayoutEffect(() => {
    if (!defaults) return;
    const nav = document.querySelector('div.x-actions');
    const root = document.querySelector('div.x-2d-area');
    const room = root.querySelector('div.x-2d-room');
    const table = room.querySelector('div.x-table');
    const actions = root.querySelector('div.x-playing-actions');
    const token = localStorage.getItem(Token.auth);
    if (!token) {
      return Alert(AlertType.ERROR, 'Token not found in storage', 10);
    }
    // send token on init request
    const socketIO = socketIOClient(SOCKET_ENDPOINT, {
      query: `${Token.auth}=${token}`,
      autoConnect: true,
      secure: true,
    });
    socketIO.on('connect', () => {
      const selectors = { root, actions, table, room, nav };
      // Run the game
      const outerEllipse = new Ellipse(tableWidth - cardDiagonal / 2, tableHeight - cardDiagonal / 2);
      const game = new Game(selectors, socketIO, outerEllipse, defaults);
      game.run();
      game.onProcessGameData((data) => setGameData(data));
    });
    socketIO.on('error', (message) => {
      Alert(AlertType.ERROR, message, 10);
    });
  }, []);

  return (
    <div className={'x-2d-area no-select'} style={{ width: windowWidth }}>
      <div className="x-actions d-flex">
        <button onClick={exitRoomHandler} className="btn btn-sm btn-danger">
          Leave this room
        </button>
      </div>
      <div className="x-2d-room">
        {Object.keys(gameData.playerData).map((pos, key) => {
          return (
            <Player
              key={key}
              name={gameData.playerData[pos].name}
              cards={gameData.playerData[pos].cards}
              progress={gameData.playerData[pos].progress}
              score={gameData.playerData[pos].score}
              className={'x-seat ' + posMap[pos]}
            />
          );
        })}
        <div
          className="x-table"
          style={{
            width: tableWidth,
            height: tableHeight,
          }}
        >
          {/**/}
        </div>
      </div>
      <div className="x-playing-actions">{/**/}</div>
    </div>
  );
};