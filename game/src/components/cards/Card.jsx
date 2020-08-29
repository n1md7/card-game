import React from "react";

import src_2_of_clubs from "../../img/cards/2_of_clubs.svg";
import src_3_of_clubs from "../../img/cards/3_of_clubs.svg";
import src_4_of_clubs from "../../img/cards/4_of_clubs.svg";
import src_5_of_clubs from "../../img/cards/5_of_clubs.svg";
import src_6_of_clubs from "../../img/cards/6_of_clubs.svg";
import src_7_of_clubs from "../../img/cards/7_of_clubs.svg";
import src_8_of_clubs from "../../img/cards/8_of_clubs.svg";
import src_9_of_clubs from "../../img/cards/9_of_clubs.svg";
import src_10_of_clubs from "../../img/cards/10_of_clubs.svg";
import src_jack_of_clubs from "../../img/cards/jack_of_clubs.svg";
import src_queen_of_clubs from "../../img/cards/queen_of_clubs.svg";
import src_king_of_clubs from "../../img/cards/king_of_clubs.svg";
import src_ace_of_clubs from "../../img/cards/ace_of_clubs.svg";

import src_2_of_spades from "../../img/cards/2_of_spades.svg";
import src_3_of_spades from "../../img/cards/3_of_spades.svg";
import src_4_of_spades from "../../img/cards/4_of_spades.svg";
import src_5_of_spades from "../../img/cards/5_of_spades.svg";
import src_6_of_spades from "../../img/cards/6_of_spades.svg";
import src_7_of_spades from "../../img/cards/7_of_spades.svg";
import src_8_of_spades from "../../img/cards/8_of_spades.svg";
import src_9_of_spades from "../../img/cards/9_of_spades.svg";
import src_10_of_spades from "../../img/cards/10_of_spades.svg";
import src_jack_of_spades from "../../img/cards/jack_of_spades.svg";
import src_queen_of_spades from "../../img/cards/queen_of_spades.svg";
import src_king_of_spades from "../../img/cards/king_of_spades.svg";
import src_ace_of_spades from "../../img/cards/ace_of_spades.svg";

import src_2_of_hearts from "../../img/cards/2_of_hearts.svg";
import src_3_of_hearts from "../../img/cards/3_of_hearts.svg";
import src_4_of_hearts from "../../img/cards/4_of_hearts.svg";
import src_5_of_hearts from "../../img/cards/5_of_hearts.svg";
import src_6_of_hearts from "../../img/cards/6_of_hearts.svg";
import src_7_of_hearts from "../../img/cards/7_of_hearts.svg";
import src_8_of_hearts from "../../img/cards/8_of_hearts.svg";
import src_9_of_hearts from "../../img/cards/9_of_hearts.svg";
import src_10_of_hearts from "../../img/cards/10_of_hearts.svg";
import src_jack_of_hearts from "../../img/cards/jack_of_hearts.svg";
import src_queen_of_hearts from "../../img/cards/queen_of_hearts.svg";
import src_king_of_hearts from "../../img/cards/king_of_hearts.svg";
import src_ace_of_hearts from "../../img/cards/ace_of_hearts.svg";

import src_2_of_diamonds from "../../img/cards/2_of_diamonds.svg";
import src_3_of_diamonds from "../../img/cards/3_of_diamonds.svg";
import src_4_of_diamonds from "../../img/cards/4_of_diamonds.svg";
import src_5_of_diamonds from "../../img/cards/5_of_diamonds.svg";
import src_6_of_diamonds from "../../img/cards/6_of_diamonds.svg";
import src_7_of_diamonds from "../../img/cards/7_of_diamonds.svg";
import src_8_of_diamonds from "../../img/cards/8_of_diamonds.svg";
import src_9_of_diamonds from "../../img/cards/9_of_diamonds.svg";
import src_10_of_diamonds from "../../img/cards/10_of_diamonds.svg";
import src_jack_of_diamonds from "../../img/cards/jack_of_diamonds.svg";
import src_queen_of_diamonds from "../../img/cards/queen_of_diamonds.svg";
import src_king_of_diamonds from "../../img/cards/king_of_diamonds.svg";
import src_ace_of_diamonds from "../../img/cards/ace_of_diamonds.svg";

import cover from "../../img/card-cover.svg";

export default function Card( { rank, suit, ...props } ) {
  if ( !suit || !rank ) {
    return <img { ...props } src={ cover } alt="Cover"/>;
  }

  // covert to lowercase string
  rank = String( rank ).toLowerCase();
  suit = String( suit ).toLowerCase();

  switch ( suit ) {
    case "diamonds":
      if ( "ace" === rank ) return <img { ...props } src={ src_ace_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "2" === rank ) return <img { ...props } src={ src_2_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "3" === rank ) return <img { ...props } src={ src_3_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "4" === rank ) return <img { ...props } src={ src_4_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "5" === rank ) return <img { ...props } src={ src_5_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "6" === rank ) return <img { ...props } src={ src_6_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "7" === rank ) return <img { ...props } src={ src_7_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "8" === rank ) return <img { ...props } src={ src_8_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "9" === rank ) return <img { ...props } src={ src_9_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "10" === rank ) return <img { ...props } src={ src_10_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "jack" === rank ) return <img { ...props } src={ src_jack_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "queen" === rank ) return <img { ...props } src={ src_queen_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      if ( "king" === rank ) return <img { ...props } src={ src_king_of_diamonds } alt={ `${ rank } of ${ suit }` }/>;
      break;
    case "hearts":
      if ( "ace" === rank ) return <img { ...props } src={ src_ace_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "2" === rank ) return <img { ...props } src={ src_2_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "3" === rank ) return <img { ...props } src={ src_3_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "4" === rank ) return <img { ...props } src={ src_4_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "5" === rank ) return <img { ...props } src={ src_5_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "6" === rank ) return <img { ...props } src={ src_6_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "7" === rank ) return <img { ...props } src={ src_7_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "8" === rank ) return <img { ...props } src={ src_8_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "9" === rank ) return <img { ...props } src={ src_9_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "10" === rank ) return <img { ...props } src={ src_10_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "jack" === rank ) return <img { ...props } src={ src_jack_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "queen" === rank ) return <img { ...props } src={ src_queen_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      if ( "king" === rank ) return <img { ...props } src={ src_king_of_hearts } alt={ `${ rank } of ${ suit }` }/>;
      break;
    case "spades":
      if ( "ace" === rank ) return <img { ...props } src={ src_ace_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "2" === rank ) return <img { ...props } src={ src_2_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "3" === rank ) return <img { ...props } src={ src_3_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "4" === rank ) return <img { ...props } src={ src_4_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "5" === rank ) return <img { ...props } src={ src_5_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "6" === rank ) return <img { ...props } src={ src_6_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "7" === rank ) return <img { ...props } src={ src_7_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "8" === rank ) return <img { ...props } src={ src_8_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "9" === rank ) return <img { ...props } src={ src_9_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "10" === rank ) return <img { ...props } src={ src_10_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "jack" === rank ) return <img { ...props } src={ src_jack_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "queen" === rank ) return <img { ...props } src={ src_queen_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      if ( "king" === rank ) return <img { ...props } src={ src_king_of_spades } alt={ `${ rank } of ${ suit }` }/>;
      break;
    case "clubs":
      if ( "ace" === rank ) return <img { ...props } src={ src_ace_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "2" === rank ) return <img { ...props } src={ src_2_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "3" === rank ) return <img { ...props } src={ src_3_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "4" === rank ) return <img { ...props } src={ src_4_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "5" === rank ) return <img { ...props } src={ src_5_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "6" === rank ) return <img { ...props } src={ src_6_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "7" === rank ) return <img { ...props } src={ src_7_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "8" === rank ) return <img { ...props } src={ src_8_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "9" === rank ) return <img { ...props } src={ src_9_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "10" === rank ) return <img { ...props } src={ src_10_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "jack" === rank ) return <img { ...props } src={ src_jack_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "queen" === rank ) return <img { ...props } src={ src_queen_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      if ( "king" === rank ) return <img { ...props } src={ src_king_of_clubs } alt={ `${ rank } of ${ suit }` }/>;
      break;
  }

  return <img { ...props } src={ cover } alt="Cover"/>;
};