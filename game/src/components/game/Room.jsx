import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import Card from "../cards/Card";
import Ellipse, { ellipseRanges, random, Pythagoras } from "../../libs/Formulas";
import { suits, ranks, Rank, Suit, fullDeck } from "../../libs/Deck";
import Player from "./Player";
import "../../css/game.scss";

const SOCKET_ENDPOINT = "127.0.0.1";

export default () => {
  const [ defaults, setDefaults ] = useState( {
    windowWidth: 640,
    tableWidth: 740,
    tableHeight: 360,
    cardWidth: 60,
    cardHeight: 90,
    cardDiagonal: 10,
    xActionsHeight: 0,
    table: {
      top: 0,
      left: 0
    }
  } );
  const borderWidth = 4;
  const tableRef = useRef( null );
  const [ players, setPlayers ] = useState( {
    left: {
      name: 'jora',
      progress: 34,
      cards: 4
    },
    up: {
      name: '',
      progress: 0,
      cards: 0
    },
    right: {
      name: '',
      progress: 0,
      cards: 0
    },
    down: {
      name: '',
      progress: 0,
      cards: 0
    },
  } );
  const [ playerCards, setPlayerCards ] = useState( [] );
  const [ zIndex, setZIndex ] = useState( 0 );
  const [ deck, setDeck ] = useState( {} );
  const [ dragging, setDragging ] = useState( {
    id: null, left: 0, top: 0, target: null
  } );
  const cardDiagonal = Pythagoras(
    defaults.cardHeight,
    defaults.cardWidth
  );
  const outerEllipse = new Ellipse(
    defaults.tableWidth - cardDiagonal / 2,
    defaults.tableHeight - cardDiagonal / 2
  );

  const xTableStyle = {
    width: defaults.tableWidth,
    height: defaults.tableHeight,
  };

  useEffect( () => {
    const windowWidth = window.innerWidth;
    const xActionsHeight = window.innerHeight * 0.05;

    setDefaults( prevState => {
      prevState.windowWidth = windowWidth;
      prevState.cardDiagonal = cardDiagonal;
      prevState.xActionsHeight = xActionsHeight;

      return prevState;
    } );
  }, [] );

  useEffect( () => {
    // fixme: remove me after testing
    // populate deck of cards
    setDeck( fullDeck.splice( 0, 0 )
      .reduce( ( acc, { suit, rank } ) => {
        const id = suit + rank;
        const xMax = (defaults.tableWidth) / 2;
        const x = random( - xMax + defaults.cardDiagonal / 2, xMax - defaults.cardDiagonal );
        const [ yMin, yMax ] = outerEllipse.y( x );
        const y = random( yMin, yMax - defaults.cardDiagonal );
        const top = (defaults.tableHeight / 2) - borderWidth + y;
        const left = (defaults.tableWidth / 2) - borderWidth + x;
        const rotate = random( 0, 180 );

        return {
          ...acc,
          [ id ]: {
            id, rank, suit, top, left, rotate
          }
        }
      }, {} ) );
  }, [] );

  useEffect( () => {
    const socket = socketIOClient( SOCKET_ENDPOINT );
    // player-cards expecting an array of objects with { suit, rank }
    socket.on( "players", setPlayers );
    socket.on( "player-cards", setPlayerCards );
    socket.on( "table-cards", tableCards => {
      const {
        cardDiagonal,
        tableHeight,
        tableWidth
      } = defaults;
      setDeck(
        tableCards
          .reduce( ( acc, { suit, rank } ) => {
            const id = suit + rank;
            const xMax = (defaults.tableWidth) / 2;
            const x = random( - xMax + cardDiagonal / 2, xMax - cardDiagonal );
            const [ yMin, yMax ] = outerEllipse.y( x );
            const y = random( yMin, yMax - cardDiagonal );
            const top = (tableHeight / 2) - borderWidth + y;
            const left = (tableWidth / 2) - borderWidth + x;
            const rotate = random( 0, 180 );

            return {
              ...acc,
              [ id ]: {
                id,
                rank,
                suit,
                top,
                left,
                rotate
              }
            }
          }, {} ) );
    } );
  }, [] );

  const calculatedValues = e => {
    // 4px is table border width
    const calculatedX = e.clientX - tableRef.current.offsetLeft - borderWidth;
    const calculatedY = (
      e.clientY - tableRef.current.offsetTop
      - borderWidth - defaults.xActionsHeight
    );

    return [
      calculatedX,
      calculatedY
    ];
  };

  const tableMouseMoveHandler = e => {
    if ( dragging.id === null ) return;

    dragging.target.style.transition = "0ms all";
    const [ calculatedX, calculatedY ] = calculatedValues( e );
    let [ yMin, yMax ] = outerEllipse.y(
      calculatedX - (defaults.tableWidth / 2) - borderWidth
    );
    yMin += (defaults.tableHeight / 2);
    yMax += (defaults.tableHeight / 2);
    // stop moving a card when mouse goes outside Ellipse boundaries
    const yOutRange = yMin > calculatedY || yMax < calculatedY;
    const xOutRange = defaults.cardDiagonal / 2 - borderWidth > calculatedX ||
      calculatedX > defaults.tableWidth - defaults.cardDiagonal / 2;
    if ( xOutRange || yOutRange ) return;

    dragging.target.style.top = calculatedY - dragging.top + "px";
    dragging.target.style.left = calculatedX - dragging.left + "px";
  };

  const cardMouseDownHandler = ( id, e ) => {
    const { currentTarget } = e;
    const [ calculatedX, calculatedY ] = calculatedValues( e );
    const cardOffset = {
      top: currentTarget.offsetTop,
      left: currentTarget.offsetLeft,
    };
    const left = calculatedX - cardOffset.left;
    const top = calculatedY - cardOffset.top;
    setDragging( {
      id, left, top, target: currentTarget
    } );
    currentTarget.style.zIndex = zIndex + 1;
  };

  const cardMouseUpHandler = e => {
    setZIndex( zIndex + 1 );
    setDragging( { id: null, left: 0, top: 0, target: null } );
  };

  const disableDefaultDragging = e => {
    e.preventDefault();

    return false;
  };

  return (
    <div className={ "x-2d-area no-select" } style={ {
      width: defaults.windowWidth
    } }>
      <div className="x-actions">
        <button className="btn btn-sm btn-danger">Leave fu*kin room</button>
      </div>
      <div className="x-2d-room">
        <Player
          name={ players.left.name }
          cards={ players.left.cards }
          progress={ players.left.progress }
          className={ "x-seat x-one" }/>
        <Player
          name={ players.up.name }
          cards={ players.up.cards }
          progress={ players.up.progress }
          className={ "x-seat x-two" }/>
        <Player
          name={ players.right.name }
          cards={ players.right.cards }
          progress={ players.right.progress }
          className={ "x-seat x-three" }/>
        <Player
          name={ players.down.name }
          cards={ players.down.cards }
          progress={ players.down.progress }
          className={ "x-seat x-four" }/>

        <div className="x-table" ref={ tableRef }
             onMouseMove={ tableMouseMoveHandler }
             style={ xTableStyle }
        >
          {
            Object.values( deck )
              .map( ( { id, suit, rank, top, left, rotate } ) =>
                <Card
                  draggable={ false }
                  onDragStart={ disableDefaultDragging }
                  y={ top }
                  x={ left }
                  key={ id }
                  rotate={ rotate }
                  w={ defaults.cardWidth }
                  h={ defaults.cardHeight }
                  suit={ suit }
                  rank={ rank }
                  onMouseDown={ e => cardMouseDownHandler( id, e ) }
                  onMouseUp={ cardMouseUpHandler }
                  onClick={ function ( { target } ) {
                    // target.style.transform = `rotate(${ random( 0, 180 ) }deg)`;
                  }.bind( id ) }
                />
              )
          }
        </div>
      </div>
      <div className="x-playing-actions">
        {
          playerCards.map(
            ( { suit, rank } ) =>
              <Card
                key={ suit + rank }
                w={ 64 }
                rank={ rank }
                suit={ suit }
              />
          )
        }
      </div>
    </div>
  );
};