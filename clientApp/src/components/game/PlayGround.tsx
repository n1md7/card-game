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
import cover from '../../img/card-cover.svg';
import { Offcanvas } from 'react-bootstrap';

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
    socketIO.on('connect', () => {
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
    });
    socketIO.on('error', (message: string) => {
      Alert(AlertType.ERROR, `${message}`, 10);
    });
    socketIO.on('validation:error', (message: string) => {
      Alert(AlertType.ERROR, `[Validation] ${message}`, 10);
    });
    socketIO.on('game:error', (message: string) => {
      Alert(AlertType.ERROR, `[Game] ${message}`, 10);
    });
  }, [defaults]);

  useEffect(() => {
    console.log('Game data', gameData);
  }, [gameData]);

  return (
    <div className={'x-2d-area no-select'} style={{ width: windowWidth }}>
      <Offcanvas show={showResults} onHide={() => setShowResults(false)} scroll={true} backdrop={true} keyboard={true}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {roundResults && !!roundResults.length ? (
            <table className="table-sm table-bordered table-dark">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col style={{ background: 'rgba(152,48,48,0.53)' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>♣️-TWO</th>
                  <th>♦️-TEN</th>
                  <th>Clubs</th>
                  <th>Cards</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {roundResults.map((round: any, idx) => (
                  <>
                    <tr className="text-center" key={`r-${idx}`}>
                      <td colSpan={6}>Round {idx + 1}</td>
                    </tr>
                    {round &&
                      round.map((player: any, pid: number) => (
                        <tr className="text-center" key={`s-${pid}-${idx}`}>
                          <td valign={'middle'}>{player.name}</td>
                          <td valign={'middle'}>{player.result.hasTwoOfClubs ? 'YES' : 'NO'}</td>
                          <td valign={'middle'}>{player.result.hasTenOfDiamonds ? 'YES' : 'NO'}</td>
                          <td valign={'middle'}>{player.result.numberOfClubs}</td>
                          <td valign={'middle'}>{player.result.numberOfCards}</td>
                          <td valign={'middle'}>{player.score}</td>
                        </tr>
                      ))}
                  </>
                ))}
                {gameResults && !!gameResults.length && (
                  <>
                    <tr className="text-center" key={'hmm'}>
                      <td colSpan={6}>Summary</td>
                    </tr>
                    {gameResults.map((player: any, idx) => (
                      <>
                        <tr className="text-center" key={`h-${idx}`}>
                          <td colSpan={1}>{player.name}</td>
                          <td colSpan={4}>{player.isWinner ? 'Winner' : ''}</td>
                          <td colSpan={1}>{player.score}</td>
                        </tr>
                      </>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <div className="text-center">
              <h3>No results</h3>
            </div>
          )}
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
