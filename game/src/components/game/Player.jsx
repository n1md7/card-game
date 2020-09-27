import React, { Fragment, useState } from "react";
import Card from "../cards/Card";
import { list } from "../../helpers/Protos";

export default ( { taken, cards, progress, joinHandler, ...props } ) => {
  const style = {};
  if ( !isNaN( progress ) ) { style.width = progress + "%"}

  return (
    <div { ...props }>
      {
        !taken ?
          <div className={ "x-join" }>
            <button onClick={ joinHandler } className="btn btn-link">
              Join
            </button>
          </div> :
          <Fragment>
            <div className="x-player-cards">
              {
                list( cards ).map( i => <Card h={ 24 } key={ i }/> )
              }
            </div>
            <div className="x-progress" style={ style }>{ "" }</div>
            <div className="x-name">{ props?.name || "default" }</div>
          </Fragment>
      }
    </div>
  );
};