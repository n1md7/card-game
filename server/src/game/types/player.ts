import { CardRankName, CardSuit } from 'shared-types';

export type PlayerPositionType = 'down' | 'left' | 'up' | 'right';
export type PlayerDataType = {
  taken: boolean;
  name: string;
  progress: number;
  cards: number;
  score: number;
};
export type PlayerCardsRespType = {
  rank: CardRankName;
  suit: CardSuit;
};
export type TransformedPlayerData = {
  [position in PlayerPositionType]: PlayerDataType;
};
