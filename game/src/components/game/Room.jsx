import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "../../css/game.scss";
import Card from "../cards/Card";
import CardDom from "../../libs/Card-dom";
import { suits, ranks, Rank, Suit, fullDeck } from "../../libs/Deck";
import Player from "./Player";

export default () => {
  const [ defaults, setDefaults ] = useState( {
    w: 640,
    h: 480
  } );

  const [refs, setRefs] = useState([]);
  const [ deck, setDeck ] = useState( [] );

  useEffect( () => {
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    // unified width and height
    let originalWH = originalWidth;
    if ( originalHeight < originalWidth ) {
      originalWH = originalHeight;
    }
    // margins 15%
    const margins = 0.40;
    // set window sizes
    setDefaults( {
      // original width
      ow: originalWidth,
      // original height
      oh: originalHeight,
      owh: originalWH,
      w: originalWidth - (originalWH * margins),
      h: originalHeight - (originalWH * margins),
    } );
  }, [] );

  useEffect( () => {
    // set default refs
    setRefs(fullDeck.map(() => null));
    setDeck(
      fullDeck
        .map( ( { id, suit, rank }, i ) => {
          return {
            id, rank, suit,
            card: new CardDom( refs[ i ] )
          }
        } )
    );

    console.log( {
      deck
    } )
  }, [] );

  return (
    <div className={ "x-2d-area" }>
      <div className="x-actions">
        <button className="btn btn-sm btn-danger">Leave fu*kin room</button>
      </div>
      <div className="x-2d-room">
        <Player cards={ 1 } progress={ 10 } className={ "x-seat x-one" }/>
        <Player cards={ 2 } className={ "x-seat x-two" }/>
        <Player cards={ 3 } className={ "x-seat x-three" }/>
        <Player cards={ 4 } progress={ 76 } className={ "x-seat x-four" }/>
        <div className="x-table">
          <Card w={ 64 } rank={ "4" } suit={ "clubs" } x={ 10 }/>
          <Card w={ 64 } rotate={ 18 } rank={ "6" } suit={ "clubs" } x={ 180 }/>
          <Card w={ 64 } rotate={ 45 } rank={ "6" } suit={ "clubs" } x={ 240 }/>
          <Card w={ 64 } rotate={ 65 } rank={ "6" } suit={ "diamonds" } x={ 300 }/>
          <Card w={ 64 } rotate={ 123 } rank={ "jack" } suit={ "diamonds" } x={ 380 }/>

          {
            deck.map(({id, suit, rank, card}, i) => {
              console.log({
                id, suit, rank, card
              })
              return <Card
                w={ 40 }
                key={ i }
                ref={ refs[ i ] }
                suit={ suit }
                rank={ rank }
                onClick={ function ( e ) {
                  // e.target.style.top = '100px'
                  console.log( {
                    deck: this,
                    e: e.target
                  } )
                  // deck[ i ].card.move( {
                  //   x: i * 5,
                  //   y: i * 15
                  // } )
                }.bind( deck ) }
              />;
            })
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