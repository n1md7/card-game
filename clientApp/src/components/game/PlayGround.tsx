import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../../css/game.scss';
import { httpClient } from '../../services/httpClient';
import { useHistory } from 'react-router';
import defaultsValue from '../../constants/defaults';
import Ellipse, { Pythagoras } from '../../libs/Formulas';
import Game from '../../game/Game';
import socketIOClient from 'socket.io-client';
import { SOCKET_ENDPOINT } from '../../constants/urls';
import { Alert, AlertType } from '../../helpers/toaster';
import Player from './Player';
import { Token } from 'shared-types';
import { GameData, GameSelectorType, PlayerData, PlayerPlaceOptions } from '../../game/types';
import exampleSrc0 from '../../img/cards/2_of_clubs.svg';
import exampleSrc1 from '../../img/cards/3_of_clubs.svg';
import exampleSrc2 from '../../img/cards/jack_of_clubs.svg';
import exampleSrc3 from '../../img/cards/king_of_diamonds.svg';

export default () => {
  const history = useHistory();
  const [defaults] = useState(defaultsValue);
  const [cardHeight] = useState<number>(defaults.cardHeight);
  const [cardWidth] = useState<number>(defaults.cardWidth);
  const [cardDiagonal, setCardDiagonal] = useState<number>(defaults.cardDiagonal);
  const [tableWidth] = useState<number>(defaults.tableWidth);
  const [tableHeight] = useState<number>(defaults.tableHeight);
  const [windowWidth, setWindowWidth] = useState<number>(defaults.windowWidth);
  const [gameData, setGameData] = useState<GameData>({
    playerData: {} as PlayerData,
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
    httpClient.put('/v1/game/exit').finally(() => {
      history.push('/join');
    });
  };

  useLayoutEffect(() => {
    if (!defaults) return;
    const nav = document.querySelector('div.x-actions');
    const root = document.querySelector('div.x-2d-area');
    const room = root?.querySelector('div.x-2d-room');
    const table = room?.querySelector('div.x-table');
    const actions = root?.querySelector('div.x-playing-actions');
    const token = localStorage.getItem(Token.auth);
    if (!root || !actions || !table || !room || !nav) return;
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
      const selectors: GameSelectorType = { root, actions, table, room, nav };
      // Run the game
      const outerEllipse = new Ellipse(tableWidth - cardDiagonal / 2, tableHeight - cardDiagonal / 2);
      const game = new Game(selectors, socketIO, outerEllipse, defaults);
      game.run();
      game.onProcessGameData(setGameData);
    });
    socketIO.on('error', (message: string) => {
      Alert(AlertType.ERROR, message, 10);
    });
  }, [defaults, cardDiagonal, tableHeight, tableWidth]);

  return (
    <div className={'x-2d-area no-select'} style={{ width: windowWidth }}>
      <div className="x-actions">
        <button onClick={exitRoomHandler} className="btn btn-sm btn-danger">
          Leave this room
        </button>
      </div>
      <div className="x-2d-room">
        {Object.keys(gameData.playerData).map((position, key) => {
          return (
            <Player
              key={key}
              name={gameData.playerData[position as PlayerPlaceOptions].name}
              cards={gameData.playerData[position as PlayerPlaceOptions].cards}
              progress={gameData.playerData[position as PlayerPlaceOptions].progress}
              score={gameData.playerData[position as PlayerPlaceOptions]?.score}
              // @ts-ignore
              className={'x-seat ' + posMap[position as PlayerPlaceOptions]}
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
      <div className="x-playing-actions">
        <div>
          <img className="x-card" height="128" src={exampleSrc0} />
          <div className="x-card-actions">
            <button className="btn btn-sm btn-outline-dark">Place</button>
            <button className="btn btn-sm btn-outline-dark">Take</button>
          </div>
        </div>

        <div>
          <img className="x-card" height="128" src={exampleSrc1} />
          <div className="x-card-actions">
            <button className="btn btn-sm btn-outline-dark">Place</button>
            <button className="btn btn-sm btn-outline-dark">Take</button>
          </div>
        </div>

        <div>
          <img className="x-card" height="128" src={exampleSrc2} />
          <div className="x-card-actions">
            <button className="btn btn-sm btn-outline-dark">Place</button>
            <button className="btn btn-sm btn-outline-dark">Take</button>
          </div>
        </div>

        <div>
          <img className="x-card" height="128" src={exampleSrc3} />
          <div className="x-card-actions">
            <button className="btn btn-sm btn-outline-dark">Place</button>
            <button className="btn btn-sm btn-outline-dark">Take</button>
          </div>
        </div>

        <div>
          <img className="placeholder" height="128" src={exampleSrc0} />
          <div className="x-all-actions">
            <button className="btn btn-sm btn-outline-secondary" title="Clear all selections">
              Clear
            </button>
            {/*<button className="btn btn-sm btn-outline-secondary">Place</button>*/}
            {/*<button className="btn btn-sm btn-outline-secondary">Take</button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};
