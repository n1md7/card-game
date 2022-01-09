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
import { Offcanvas } from 'react-bootstrap';
import IdleView from './IdleView';
import Results from './Results';
import ResultsView from './ResultsView';

export default () => {
  const history = useHistory();
  const [defaults] = useState(defaultsValue);
  const [cardHeight] = useState<number>(defaults.cardHeight);
  const [cardWidth] = useState<number>(defaults.cardWidth);
  const [cardDiagonal, setCardDiagonal] = useState<number>(defaults.cardDiagonal);
  const [tableWidth] = useState<number>(defaults.tableWidth);
  const [tableHeight] = useState<number>(defaults.tableHeight);
  const [windowWidth, setWindowWidth] = useState<number>(defaults.windowWidth);
  const [roundResults, setRoundResults] = useState<null | Object[]>(null);
  const [gameResults, setGameResults] = useState<null | Object[]>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [idle, setIdle] = useState<number>(0);
  const [showGameResults, setShowGameResults] = useState<boolean>(false);
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

  const handleGameResultData = (data: null | Object[]) => {
    setGameResults(data);
    setShowGameResults(true);
  };

  useLayoutEffect(() => {
    if (!defaults) return;
    const nav = document.querySelector('div.x-actions');
    const root = document.querySelector('div.x-2d-area');
    const room = root?.querySelector('div.x-2d-room');
    const table = room?.querySelector('div.x-table .x-cards-container');
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
      reconnection: true,
      reconnectionAttempts: 8,
      secure: true,
    });
    socketIO
      .on('connect', () => {
        const selectors: GameSelectorType = {
          root: root as HTMLDivElement,
          actions: actions as HTMLDivElement,
          table: table as HTMLDivElement,
          room: room as HTMLDivElement,
          nav: nav as HTMLDivElement,
        };
        // Run the game
        const outerEllipse = new Ellipse(tableWidth - cardDiagonal / 2, tableHeight - cardDiagonal / 2);
        const game = new Game(selectors, socketIO, outerEllipse, defaults);
        game.run();
        game.onProcessGameData(setGameData);
        game.onOffcanvasGameResults(setRoundResults, setGameResults);
        console.log('Connected to game room');
        console.log('Status: pending...');
      })
      .on('idle-game-before-next-round', (idleTimeInMillis: number) => {
        setIdle(idleTimeInMillis);
        console.log('Status: idle-game-before-next-round', idleTimeInMillis);
      })
      .on('final:game:results', (gameResult: Object[]) => {
        setShowGameResults(true);
        setGameResults(gameResult);
      })
      .on('disconnect', () => {
        console.log('Disconnected from game room');
      })
      .on('error', (message: string) => {
        Alert(AlertType.ERROR, `${message}`, 10);
      })
      .on('validation:error', (message: string) => {
        Alert(AlertType.ERROR, `[Validation] ${message}`, 10);
      })
      .on('game:error', (message: string) => {
        Alert(AlertType.ERROR, `[Game] ${message}`, 10);
      });
  }, [defaults]);

  useEffect(() => {
    console.log('Game data', gameData);
  }, [gameData]);

  return (
    <div className={'x-2d-area no-select'} style={{ width: windowWidth }}>
      {!!idle && (
        <IdleView idleTime={idle}>
          <Results style={{ margin: 'auto' }} gameResults={gameResults} roundResults={roundResults} />
        </IdleView>
      )}
      {showGameResults && (
        <ResultsView>
          <Results style={{ margin: 'auto' }} gameResults={gameResults} roundResults={roundResults} />
        </ResultsView>
      )}
      <Offcanvas show={showResults} onHide={() => setShowResults(false)} scroll={true} backdrop={true} keyboard={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Results</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Results gameResults={gameResults} roundResults={roundResults} />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="x-actions">
        <button onClick={() => setShowResults(true)} className="btn btn-sm btn-secondary me-2 align-self-start">
          Results
        </button>
        <button onClick={exitRoomHandler} className="btn btn-sm btn-danger">
          Leave
        </button>
      </div>
      <div className="x-2d-room">
        {Object.keys(gameData.playerData).map((position, key) => {
          return (
            <Player
              key={key}
              name={gameData.playerData[position as PlayerPlaceOptions].name}
              cards={gameData.playerData[position as PlayerPlaceOptions].cards}
              time={gameData.playerData[position as PlayerPlaceOptions].time}
              isActive={gameData.playerData[position as PlayerPlaceOptions].isActive}
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
          <div className="x-placeholder-text">
            <h1>Phurt.io</h1>
          </div>
          <div className="x-cards-container" />
        </div>
      </div>
      <div className="x-playing-actions">
        <div>
          <div className="x-card" />
        </div>
        <div>
          <div className="x-card" />
        </div>
        <div>
          <div className="x-card" />
        </div>
        <div>
          <div className="x-card" />
        </div>
      </div>
    </div>
  );
};
