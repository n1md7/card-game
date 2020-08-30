import React, { useEffect, useState } from "react";
import cover from "../../img/card-cover.svg";
import { ReactSVG } from "react-svg";

export default function Card( { rank, suit, svg, ...props } ) {

  const [ src, setSrc ] = useState( cover );
  const cardName = `${ rank }_of_${ suit }`;
  // covert to lowercase string
  rank = String( rank ).toLowerCase();
  suit = String( suit ).toLowerCase();

  useEffect( () => {
    if ( suit && rank ) {
      try {
        setSrc( require( `../../img/cards/${cardName}.svg` ) );
      } catch ( e ) {
        // such image does not exist
        // so stick with cover one
      }
    }
  }, [] );

  const afterInjectionHandler = ( error, svg ) => {
    // console.log(svg)
  };

  const beforeInjectionHandler = ( svg ) => {
    svg.classList.add( cardName );
    svg.classList.add( 'x-card' );
  };

  if ( !svg ) {
    return <img className='x-card' { ...props } src={ src } alt="Cover"/>;
  }

  return <ReactSVG
    src={ src }
    afterInjection={ afterInjectionHandler }
    beforeInjection={ beforeInjectionHandler }
    evalScripts="always"
    fallback={ () => <span>Error!</span> }
    loading={ () => <span>loading...</span> }
    renumerateIRIElements={ false }
    wrapper="span"
    onClick={ () => {
      console.log( `svg ${cardName} clicked` )
    } }
    { ...props }
  />;
};