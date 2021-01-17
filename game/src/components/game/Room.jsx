import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import Card from "../cards/Card";
import Ellipse, { random, Pythagoras } from "../../libs/Formulas";
import Player from "./Player";
import { SOCKET_ENDPOINT } from "../../constants/urls";
import defaultsValue, { playersValue, draggingValue } from "../../constants/defaults";
import "../../css/game.scss";
import { Alert, AlertType } from "../../helpers/toaster";

export default () => {
  const borderWidth = 4;
  const [ socket, setSocket ] = useState( null );
  const [ defaults, setDefaults ] = useState( defaultsValue );
  const tableRef = useRef( null );
  const [ players, setPlayers ] = useState( playersValue );
  const [ playerCards, setPlayerCards ] = useState( [] );
  const [ zIndex, setZIndex ] = useState( 0 );
  const [ deck, setDeck ] = useState( {} );
  const [ dragging, setDragging ] = useState( draggingValue );
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
    const token = localStorage.getItem( "token" );
    // send token on init request
    const io = socketIOClient( SOCKET_ENDPOINT, {
      query: `token=${ token }`
    } );
    setSocket( io );
    // player-cards expecting an array of objects with { suit, rank }
    io.on( "error", message => {
      Alert( AlertType.ERROR, message, 10 );
    } );
    io.on( "players", setPlayers );
    io.on( "player-cards", setPlayerCards );
    io.on( "table-cards:add", cards => {
      const {
        cardDiagonal,
        tableHeight,
        tableWidth
      } = defaults;
      setDeck( prevState => {
        cards
          .forEach( ( { suit, rank } ) => {
            const id = suit + rank;
            if ( !prevState.hasOwnProperty( id ) ) {
              const xMax = (defaults.tableWidth) / 2;
              const x = random(
                - xMax + cardDiagonal / 2,
                + xMax - cardDiagonal
              );
              const [ yMin, yMax ] = outerEllipse.y( x );
              const y = random( yMin, yMax - cardDiagonal );
              const top = (tableHeight / 2) - borderWidth + y;
              const left = (tableWidth / 2) - borderWidth + x;
              const rotate = random( 0, 180 );

              prevState[ id ] = {
                id,
                rank,
                suit,
                top,
                left,
                rotate
              };
            }
          } );

        return prevState;
      } );
    } );
    io.on( "table-cards:remove", cards => {
      setDeck( prevState => {
        cards
          .forEach( ( { suit, rank } ) => {
            const id = suit + rank;
            if ( prevState.hasOwnProperty( id ) ) {
              delete prevState[ id ];
            }
          } );

        return prevState;
      } );
    } );
  }, [] );

  const playerJoinHandler = seat => {
    if ( null === socket ) return;
    //socket.emit( "player:join", { seat } );
    socket.emit( "player:move", { playerCard: { suit: "hearts", rank: "5" }, tableCards: [] } );
  };

  const calculatedValues = e => {
    // 4px is table border width
    const calculatedX = e.clientX - tableRef.current?.offsetLeft - borderWidth;
    const calculatedY = (
      e.clientY - tableRef.current?.offsetTop
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