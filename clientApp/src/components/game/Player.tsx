import React from 'react';
import Card from '../cards/Card';
import { list } from '../../helpers/Protos';

type Props = {
  cards: number;
  progress: number;
  name: string;
  score?: number;
  props: {
    [Key in keyof React.HTMLAttributes<HTMLDivElement>]: React.HTMLAttributes<HTMLDivElement>;
  };
};
type Style = {
  width: string;
};
export default ({ cards, progress, ...props }: Props) => {
  const style: Style = {} as Style;
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
          // @ts-ignore
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
