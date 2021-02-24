import {useEffect, useState} from 'react';
import {SOCKET_ENDPOINT} from '../../../constants/urls';
import {Alert, AlertType} from '../../../helpers/toaster';
import {random} from '../../../libs/Formulas';
import socketIOClient, {Socket} from 'socket.io-client';
import {gameDataDefault} from '../../../constants/defaults';
import useDefaults from './useDefaults';

type EllipseType = {
  y: (x: number) => [number, number]
}

type Defaults = {
  windowWidth: number;
  tableWidth: number;
  tableHeight: number;
  cardWidth: number;
  cardHeight: number;
  cardDiagonal: number;
  xActionsHeight: number;
  table: {
    top: number;
    left: number;
  };
};

type Card = {
  rank: string;
  suit: string;
  key: string;
};

type TakeCards = {
  playerId: string,
  playerCard: string,
  tableCards: string
};

const useSockets = () => {
  const borderWidth = 4;

  const [socket, setSocket] = useState<typeof Socket|null>(null);
  const [gameData, setGameData] = useState(gameDataDefault);
  const [playerCards, setPlayerCards] = useState([]);
  const [deck, setDeck] = useState({});
  const [outerEllipse, defaults, xTableStyle] = useDefaults();

  useEffect((): any => {
    const token = localStorage.getItem('token');
    // send token on init request
    const io = socketIOClient(SOCKET_ENDPOINT, {
      query: `token=${token}`,
      autoConnect: true,
      secure: true,
    });
    setSocket(io);
    // player-cards expecting an array of objects with { suit, rank }
    io.on('error', (message: string) => {
      Alert(AlertType.ERROR, message, 10);
    });
    io.on('game:data', setGameData);
    io.on('game:finish', (data: any) => console.dir(data));
    io.on('game:finish-deck', (data: any) => console.dir(data));
    io.on('player-cards', setPlayerCards);
    io.on('game:take-cards', (data: any) => console.dir(data));
    io.on('table-cards:add', (cards: Card[]) => {
      const {
        cardDiagonal: $cardDiagonal,
        tableHeight,
        tableWidth,
      } = defaults as Defaults;
      setDeck((prevState: any) => {
        // remove card(s) that is(are) already taken
        for (let prevStateKey in prevState) {
          if (cards.findIndex(item => item.key === prevStateKey) === -1) {
            // this card has been removed from the server
            // need to remove from the table too
            delete prevState[prevStateKey];
          }
        }

        // add new card
        cards
          .forEach(({suit, rank}) => {
            const id = suit + rank;
            if (!prevState.hasOwnProperty(id)) {
              const xMax = ((defaults as Defaults).tableWidth) / 2;
              const x = random(
                -xMax + $cardDiagonal / 2,
                +xMax - $cardDiagonal,
              );
              const [yMin, yMax] = (outerEllipse as EllipseType).y(x);
              const y = random(yMin, yMax - $cardDiagonal);
              const top = (tableHeight / 2) - borderWidth + y;
              const left = (tableWidth / 2) - borderWidth + x;
              const rotate = random(0, 180);

              prevState[id] = {
                id,
                rank,
                suit,
                top,
                left,
                rotate,
              };
            }
          });

        return prevState;
      });
    });
    io.on('table-cards:remove', (cards: Card[]) => {
      setDeck((prevState: any) => {
        cards
          .forEach(({suit, rank}: Card) => {
            const id = suit + rank;
            if (prevState.hasOwnProperty(id)) {
              delete prevState[id];
            }
          });

        return prevState;
      });
    });
    io.on('game:take-cards', (cards: TakeCards) => {
      //const {playerId, playerCard, tableCards} = cards;
    });

    // Clean up
    return () => io.close();
  }, []);

  return [
    socket,
    playerCards,
    gameData.playerData,
    gameData,
    outerEllipse,
    defaults,
    deck,
    xTableStyle,
  ];
};

export default useSockets;
