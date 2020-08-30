import React, { useEffect, useRef, useState } from "react";
import "../../css/game.scss";
import Card from "../cards/Card";


export default () => {
  const [ defaults, setDefaults ] = useState( {
    w: 640,
    h: 480
  } );
  useEffect( () => {
    const originalWidth = window.outerWidth;
    const originalHeight = window.outerHeight;
    // unified width and height
    let originalWH = originalWidth;
    if ( originalHeight < originalWidth ) {
      originalWH = originalHeight;
    }
    // margins 15%
    const margins = 0.15;
    // set window sizes
    setDefaults( {
      // original width
      ow: originalWidth,
      // original height
      oh: originalHeight,
      w: originalWH - (originalWH * margins),
      h: originalWH - (originalWH * margins),
    } );
  }, [] );

  return (
    <div style={ { width: defaults.w, height: defaults.h } } className="x-room-table">

    </div>
  );
};