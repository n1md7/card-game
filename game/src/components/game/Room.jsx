import React, { useRef, useState} from 'react';
import Card from '../cards/Card';
import Player from './Player';
import {draggingValue} from '../../constants/defaults';
import '../../css/game.scss';
import {httpClient} from '../../services/httpClient';
import useSockets from './hooks/useSockets';
import {CardColumns} from 'react-bootstrap';

export default () => {
  const borderWidth = 4;
  const tableRef = useRef(null);
  const [zIndex, setZIndex] = useState(0);
  const [dragging, setDragging] = useState(draggingValue);
  const [playerCardSelected, setPlayerCardSelected] = useState({});
  const [tableCardsSelected, setTableCardsSelected] = useState({});
  const [redirect, setRedirect] = useState(false);
  const playerCardRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [
    socket, playerCards,
    players,
    gameData,
    outerEllipse,
    defaults,
    deck,
    xTableStyle
  ] = useSockets();

  const calculatedValues = e => {
    // 4px is table border width
    const calculatedX = e.clientX - tableRef.current?.offsetLeft - borderWidth;
    const calculatedY = (
      e.clientY - tableRef.current?.offsetTop
      - borderWidth - defaults.xActionsHeight
    );

    return [
      calculatedX,
      calculatedY,
    ];
  };

  const makeAMoveHandler = () => {
    if (null === socket) return;
    setPlayerCardSelected({});
    setTableCardsSelected({});
    socket.emit('player:move', {
      playerCard: playerCardSelected,
      tableCards: Object.values(tableCardsSelected),
    });
  };

  const playerCardClickHandler = ({rank, suit}) => ({target}) => {
    setPlayerCardSelected({rank, suit});
    playerCardRefs.forEach(({current}) => current?.classList.remove('x-card-selected'));
    target.classList.add('x-card-selected');
  };

  const tableCardClickHandler = ({rank, suit}) => ({target}) => {
    const key = rank + suit;
    const tmpTableCardsSelected = {...tableCardsSelected};
    if (tmpTableCardsSelected.hasOwnProperty(key)) {
      delete tmpTableCardsSelected[key];
      setTableCardsSelected(tmpTableCardsSelected);
    } else {
      setTableCardsSelected({...tmpTableCardsSelected, [key]: {rank, suit}});
    }
    target.classList.toggle('x-card-selected');
  };

  const leaveRoomHandler = async () => {
    await httpClient.get('/leave-room');
    setRedirect(true);
  };

  const tableMouseMoveHandler = e => {
    if (dragging.id === null) return;

    dragging.target.style.transition = '0ms all';
    const [calculatedX, calculatedY] = calculatedValues(e);
    let [yMin, yMax] = outerEllipse.y(
      calculatedX - (defaults.tableWidth / 2) - borderWidth,
    );
    yMin += (defaults.tableHeight / 2);
    yMax += (defaults.tableHeight / 2);
    // stop moving a card when mouse goes outside Ellipse boundaries
    const yOutRange = yMin > calculatedY || yMax < calculatedY;
    const xOutRange = defaults.cardDiagonal / 2 - borderWidth > calculatedX ||
      calculatedX > defaults.tableWidth - defaults.cardDiagonal / 2;
    if (xOutRange || yOutRange) return;

    dragging.target.style.top = calculatedY - dragging.top + 'px';
    dragging.target.style.left = calculatedX - dragging.left + 'px';
  };

  const cardMouseDownHandler = (id, e) => {
    const {currentTarget} = e;
    const [calculatedX, calculatedY] = calculatedValues(e);
    const cardOffset = {
      top: currentTarget.offsetTop,
      left: currentTarget.offsetLeft,
    };
    const left = calculatedX - cardOffset.left;
    const top = calculatedY - cardOffset.top;
    setDragging({
      id, left, top, target: currentTarget,
    });
    currentTarget.style.zIndex = zIndex + 1;
  };

  const cardMouseUpHandler = e => {
    setZIndex(zIndex + 1);
    setDragging({id: null, left: 0, top: 0, target: null});
  };

  const disableDefaultDragging = e => {
    e.preventDefault();

    return false;
  };

  return redirect ? (
    //FIXME: redirection is problem here
    // <Redirect to={`/rooms`}/>
    <span>redirecting...</span>
  ) : (
    <div className={'x-2d-area no-select'} style={{
      width: defaults.windowWidth,
    }}>
      <div className="x-actions d-flex">
        <button
          onClick={leaveRoomHandler}
          className="btn btn-sm btn-danger">
          Leave fu*kin room
        </button>
      </div>
      <div className="card-deck">
        <Card
          draggable={false}
          onDragStart={disableDefaultDragging}
          y={0}
          x={0}
          key={5}
          rotate={0}
          w={defaults.cardWidth}
          h={defaults.cardHeight}
          suit={"suit"}
          rank={"rank"}
        />
        <span className="card-deck-digit">{gameData.remainedCards}</span>
      </div>
      <div className="x-2d-room">
        <Player
          name={players.left.name}
          cards={players.left.cards}
          progress={players.left.progress}
          score={players.left.score}
          className={'x-seat x-one'}/>
        <Player
          name={players.up.name}
          cards={players.up.cards}
          progress={players.up.progress}
          score={players.up.score}
          className={'x-seat x-two'}/>
        <Player
          name={players.right.name}
          cards={players.right.cards}
          progress={players.right.progress}
          score={players.right.score}
          className={'x-seat x-three'}/>
        <Player
          name={players.down.name}
          cards={players.down.cards}
          progress={players.down.progress}
          score={players.down.score}
          className={'x-seat x-four'}/>

        <div className="x-table" ref={tableRef}
             onMouseMove={tableMouseMoveHandler}
             style={xTableStyle}
        >
          {
            Object.values(deck)
              .map(({id, suit, rank, top, left, rotate}) =>
                <Card
                  draggable={false}
                  onDragStart={disableDefaultDragging}
                  y={top}
                  x={left}
                  key={id}
                  rotate={rotate}
                  w={defaults.cardWidth}
                  h={defaults.cardHeight}
                  suit={suit}
                  rank={rank}
                  onMouseDown={e => cardMouseDownHandler(id, e)}
                  onMouseUp={cardMouseUpHandler}
                  onClick={tableCardClickHandler({rank, suit})}
                />,
              )
          }
        </div>
      </div>
      <div className="x-playing-actions">
        {
          playerCards.map(
            ({suit, rank}, index) =>
              <Card
                ref={playerCardRefs[index]}
                onClick={playerCardClickHandler({rank, suit})}
                key={suit + rank}
                w={64}
                rank={rank}
                suit={suit}
              />,
          )
        }
        <button
          onClick={makeAMoveHandler}
          className="btn btn-outline-danger btn-group-lg"
        >
          Make a move
        </button>
      </div>
    </div>
  );
};