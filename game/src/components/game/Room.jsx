import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "../../css/game.scss";
import Card from "../cards/Card";
import Ellipse, { ellipseRanges, random, Pythagoras } from "../../libs/Formulas";
import CardDom from "../../libs/Card-dom";
import { suits, ranks, Rank, Suit, fullDeck } from "../../libs/Deck";
import Player from "./Player";

export default () => {
  const [ defaults, setDefaults ] = useState( {
    windowWidth: 640,
    tableWidth: 740,
    tableHeight: 360,
    cardWidth: 40,
    cardHeight: 60,
    cardDiagonal: 10
  } );
  const [ deck, setDeck ] = useState( [] );

  useEffect( () => {
    const windowWidth = window.innerWidth;
    const cardDiagonal = Pythagoras(
      defaults.cardHeight,
      defaults.cardWidth
    );
    Ellipse.setDimensions(
      defaults.tableWidth - cardDiagonal / 2,
      defaults.tableHeight - cardDiagonal / 2
    );
    setDefaults( prevState => {
      prevState.windowWidth = windowWidth;
      prevState.cardDiagonal = cardDiagonal;

      return prevState;
    } );
  }, [] );

  useEffect( () => {
    // populate deck of cards
    setDeck( fullDeck
      .map( ( { id, suit, rank } ) => {
        return {
          id, rank, suit
        }
      } ) );
  }, [] );

  useEffect( () => {
    // Ellipse.setDimensions( 200, 100 );
    console.log( {
      deck
    } )
  } )

  return (
    <div className={ "x-2d-area no-select" } style={ {
      width: defaults.windowWidth
    } }>
      <div className="x-actions">
        <button className="btn btn-sm btn-danger">Leave fu*kin room</button>
      </div>
      <div className="x-2d-room">
        <Player cards={ 1 } progress={ 10 } className={ "x-seat x-one" }/>
        <Player cards={ 2 } className={ "x-seat x-two" }/>
        <Player cards={ 3 } className={ "x-seat x-three" }/>
        <Player cards={ 4 } progress={ 76 } className={ "x-seat x-four" }/>
        <div className="x-table" style={ {
          width: defaults.tableWidth,
          height: defaults.tableHeight,
        } }>
          {
            deck.map( ( { id, suit, rank, card }, i ) => {
              const xMax = (defaults.tableWidth) / 2;
              const x = random( - xMax + defaults.cardDiagonal, xMax - defaults.cardDiagonal );
              const [ yMin, yMax ] = Ellipse.y( x );
              const y = random( yMin, yMax - defaults.cardDiagonal );
              const top = (defaults.tableHeight / 2) - 4 + y;
              const left = (defaults.tableWidth / 2) - 4 + x;

              return <Card
                y={ top }
                x={ left }
                key={ id }
                rotate={ random( 0, 180 ) }
                w={ defaults.cardWidth }
                h={ defaults.cardHeight }
                suit={ suit }
                rank={ rank }
                onClick={ function ( { target } ) {
                  const xMax = (defaults.tableWidth) / 2;
                  const x = random( - xMax + defaults.cardDiagonal, xMax - defaults.cardDiagonal );
                  const [ yMin, yMax ] = Ellipse.y( x );
                  const y = random( yMin, yMax - defaults.cardDiagonal );
                  const top = (defaults.tableHeight / 2) - 4 + y;
                  const left = (defaults.tableWidth / 2) - 4 + x;
                  target.style.zIndex = i + 52;
                  target.style.top = top + "px";
                  target.style.left = left + "px";
                  target.style.transform = `rotate(${ random( 0, 180 ) }deg)`;
                }.bind( id ) }
              />;
            } )
          }

        </div>
      </div>
      <div className="x-playing-actions">
        <Card w={ 64 } rank={ "ace" } suit={ "diamonds" }/>
        <Card w={ 64 } rank={ "ace" } suit={ "clubs" }/>
        <Card w={ 64 } rank={ "ace" } suit={ "hearts" }/>
        <Card w={ 64 } rank={ "10" } suit={ "hearts" }/>
      </div>
    </div>
  );
};