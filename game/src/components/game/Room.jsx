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
          {/*<Card w={ 64 } rank={ "4" } suit={ "clubs" } x={ 10 }/>*/ }
          {/*<Card w={ 64 } rotate={ 18 } rank={ "6" } suit={ "clubs" } x={ 180 }/>*/ }
          {/*<Card w={ 64 } rotate={ 45 } rank={ "6" } suit={ "clubs" } x={ 240 }/>*/ }
          {/*<Card w={ 64 } rotate={ 65 } rank={ "6" } suit={ "diamonds" } x={ 300 }/>*/ }
          {/*<Card w={ 64 } rotate={ 123 } rank={ "jack" } suit={ "diamonds" } x={ 380 }/>*/ }

          {
            deck.map( ( { id, suit, rank, card }, i ) => {
              const xMax = (defaults.tableWidth) / 2;
              const x = random( - xMax + defaults.cardDiagonal/2, xMax - defaults.cardDiagonal );
              const [ yMin, yMax ] = Ellipse.y( x );
              const y = random( yMin - defaults.cardDiagonal, yMax );
              const top = (defaults.tableHeight / 2) - 4 + y;
              const left = (defaults.tableWidth / 2) - 4 + x;

              return <Card
                y={ top }
                x={ left }
                rotate={ random( 0, 180 ) }
                key={ id }
                w={ defaults.cardWidth }
                h={ defaults.cardHeight }
                suit={ suit }
                rank={ rank }
                onClick={ function ( { target } ) {
                  const yMax = (defaults.tableHeight) / 2;
                  const y = random( - yMax - defaults.cardHeight, yMax );
                  const [ xMin, xMax ] = Ellipse.x( y );
                  const x = random( xMin, xMax );
                  target.style.top = (defaults.tableHeight / 2) - 4 + y + "px";
                  target.style.left = (defaults.tableWidth / 2) - 4 + x + "px";
                  target.style.transform = `rotate(${ random( 0, 180 ) }deg)`;
                  console.log( {
                    deck: this,
                    e: target
                  } )
                }.bind( id ) }
              />;
            } )
          }
          {
            ellipseRanges( (defaults.tableWidth - defaults.cardWidth) / 2, 15 ).map( i => {
              let x = i;
              // x += 200;
              const y = Ellipse.y( x );
              return y.map( ( val, key ) => (
                <div key={ key } style={ {
                  width: "1px",
                  height: "1px",
                  border: "1px solid white",
                  position: "absolute",
                  top: (defaults.tableHeight / 2) - 4 + val + "px",
                  left: (defaults.tableWidth / 2) - 4 + x + "px",
                } }>{/**/ }</div>
              ) )
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