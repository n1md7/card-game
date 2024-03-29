import { Socket } from 'socket.io-client';

export type GameSelectorType = {
  root: HTMLDivElement;
  table: HTMLDivElement;
  actions: HTMLDivElement;
  room: HTMLDivElement;
  nav: HTMLDivElement;
};
export type SocketType = typeof Socket;

export enum PlayerPlaceOptions {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type PlayerData = {
  [places in PlayerPlaceOptions]: {
    taken: boolean;
    name: string;
    time: number;
    cards: number;
    isActive: boolean;
  };
};

export type GameData = {
  playerData: PlayerData;
  remainedCards: number | null;
};

export enum Event {
  playerTurn = 'player:turn',
  gamePlayers = 'game:players-data',
  gameFinish = 'game:finish',
  gameFinishDeck = 'game:finish-deck',
  gameTakeCards = 'game:take-cards',
  playerCards = 'player-cards',
  tableCardsAdd = 'table-cards:add',
  tableCardsRemove = 'table-cards:remove',
}

export enum Rank {
  ACE = 'ace',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'jack',
  QUEEN = 'queen',
  KING = 'king',
}

export enum Suit {
  SPADES = 'spades',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  HEARTS = 'hearts',
}

export type TableCardType = {
  rank: Rank;
  suit: Suit;
  key: string; //Suit&Rank
  top?: number;
  left?: number;
  rotate?: number;
};

export type PlayerCardType = {
  name: Rank;
  suit: Suit;
  value: string;
};

export type AddCardType = {
  cards: PlayerCardType | PlayerCardType[];
  position: PlayerPlaceOptions;
};

export type Defaults = {
  windowWidth: number;
  tableWidth: number;
  tableHeight: number;
  cardWidth: number;
  cardHeight: number;
  cardDiagonal: number;
  xActionsHeight: number;
  table: {
    top: number;
    left: number;
  };
};

export type EllipseType = {
  y: (x: number) => [number, number];
};

export type PlayerScoresCardDto = {
  position: PlayerPlaceOptions;
  playerCard: PlayerCardType;
  tableCards: PlayerCardType[];
};
