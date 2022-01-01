import { PlayerResult } from '../PlayerResult';

export type RoundResult = {
  playerId: string;
  name: string;
  result: PlayerResult;
  score: number;
  round: number;
};
export type GameResult = Omit<RoundResult, 'round' | 'result'> & {
  isWinner: boolean;
};
