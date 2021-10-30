import React, { useEffect, useRef, useState } from 'react';
import cover from '../../img/card-cover.svg';
import { ReactSVG } from 'react-svg';

export default React.forwardRef(({ rank, suit, svg, x, y, w, h, rotate, selected, ...props }, ref) => {
  const [src, setSrc] = useState(cover);
  const cardName = `${rank}_of_${suit}`;
  const style = {};
  // covert to lowercase string
  rank = rank && String(rank).toLowerCase();
  suit = suit && String(suit).toLowerCase();
  style.left = x ? x : 96 + 'px';
  style.top = y ? y : 128 + 'px';
  if (w) {
    style.width = w + 'px';
  }
  if (h) {
    style.height = h + 'px';
  }
  if (rotate) {
    style.transform = `rotate(${rotate}deg)`;
  }

  useEffect(() => {
    if (suit && rank) {
      try {
        setSrc(require(`../../img/cards/${cardName}.svg`));
      } catch (e) {
        // such image does not exist
        // so stick with cover one
      }
    }
  }, []);

  const afterInjectionHandler = (error, svg) => {
    // console.log(svg)
  };

  const beforeInjectionHandler = (svg) => {
    svg.classList.add(cardName);
    svg.classList.add('x-card');
  };

  if (!svg) {
    return (
      <img
        ref={ref}
        style={style}
        className={'x-card'}
        {...props}
        src={src}
        alt={(rank && suit && cardName) || 'cover'}
      />
    );
  }

  return (
    <ReactSVG
      style={style}
      src={src}
      afterInjection={afterInjectionHandler}
      beforeInjection={beforeInjectionHandler}
      // evalScripts="always"
      fallback={() => <span>Error!</span>}
      loading={() => <span>loading...</span>}
      renumerateIRIElements={false}
      wrapper="span"
      onClick={() => {
        console.log(`svg ${cardName} clicked`);
      }}
      {...props}
    />
  );
});
