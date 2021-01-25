export default {
  windowWidth: 640,
  tableWidth: 740,
  tableHeight: 360,
  cardWidth: 60,
  cardHeight: 90,
  cardDiagonal: 10,
  xActionsHeight: 0,
  table: {
    top: 0,
    left: 0,
  },
};

export const gameDataDefault = {
  playerData: {
    left: {
      taken: false,
      name: '',
      progress: 0,
      cards: 0,
      score: 0,
    },
    up: {
      taken: false,
      name: '',
      progress: 0,
      cards: 0,
      score: 0,
    },
    right: {
      taken: false,
      name: '',
      progress: 0,
      cards: 0,
      score: 0,
    },
    down: {
      taken: false,
      name: '',
      progress: 0,
      cards: 0,
      score: 0,
    },
  },
  remainedCards: 0,
};

export const draggingValue = {
  id: null,
  left: 0,
  top: 0,
  target: null,
};

export const gamePosition = {
  left: 'x-seat x-one',
  up: 'x-seat x-two',
  right: 'x-seat x-three',
  down: 'x-seat x-four',
};
