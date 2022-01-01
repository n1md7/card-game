import React from 'react';
import Card from '../cards/Card';
import { list } from '../../helpers/Protos';
import Spinner from 'react-bootstrap/Spinner';

type Props = {
  cards: number;
  time: number;
  isActive: boolean;
  name: string;
  props: {
    [Key in keyof React.HTMLAttributes<HTMLDivElement>]: React.HTMLAttributes<HTMLDivElement>;
  };
};

export default ({ cards, time, isActive, ...props }: Props) => {
  if (!props?.name) {
    return <div {...props}>{''}</div>;
  }
  const style = isActive
    ? {
        animation: `width-animation ${time}s reverse ease-out`,
      }
    : {};

  return (
    <div {...props}>
      <div className="x-player-cards">
        {cards ? (
          list(cards).map((i) => (
            // @ts-ignore
            <Card h={24} key={i} />
          ))
        ) : (
          <Spinner animation="grow" variant="danger" size="sm" />
        )}
      </div>
      <div className="x-progress" style={style}>
        {''}
      </div>
      <div className="x-name">{props.name}</div>
    </div>
  );
};
