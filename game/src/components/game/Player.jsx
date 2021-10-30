import React from 'react';
import Card from '../cards/Card';
import { list } from '../../helpers/Protos';

export default ({ cards, progress, ...props }) => {
  const style = {};
  if (!isNaN(progress)) {
    style.width = progress + '%';
  }

  if (!props?.name) {
    return <div {...props}>{''}</div>;
  }

  return (
    <div {...props}>
      <div className="x-player-cards">
        {list(cards).map((i) => (
          <Card h={24} key={i} />
        ))}
      </div>
      <div className="x-progress" style={style}>
        {''}
      </div>
      <div className="x-name">{props.name}</div>
      <div className="x-score">{props?.score || 0}</div>
    </div>
  );
};
