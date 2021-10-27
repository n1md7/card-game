import PlayerStore from './PlayerStore';
import GameStore from './GameStore';
import UserStore from './UserStore';

const playerStore = new PlayerStore();
const gameStore = new GameStore();
const userStore = new UserStore();

export { playerStore, gameStore, userStore };
