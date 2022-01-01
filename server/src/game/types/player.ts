import { CardRankName, CardSuit } from 'shared-types';

export type PlayerPositionType = 'down' | 'left' | 'up' | 'right';
export type PlayerDataType = {
  taken: boolean;
  name: string;
  time: number;
  cards: number;
  isActive: boolean;
};
export type PlayerCardsRespType = {
  rank: CardRankName;
  suit: CardSuit;
};
export type TransformedPlayerData = {
  [position in PlayerPositionType]: PlayerDataType;
};
