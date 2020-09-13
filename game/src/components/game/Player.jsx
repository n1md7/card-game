import React, { Fragment, useState } from "react";
import Card from "../cards/Card";
import { list } from "../../helpers/Protos";

export default ( { cards, progress, ...props } ) => {
  const style = {};
  if ( progress ) { style.width = progress + "%"}
  const [ seat, setSeat ] = useState( false );

  const joinHandler = e => {
    setSeat( true );
  };


  return (
    <div { ...props }>
      {
        !seat ?
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
            <div className="x-name">{ "nimda" }</div>
          </Fragment>
      }
    </div>
  );
};