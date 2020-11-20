import PlayerStore from "./player";
import GameStore from "./game";
import UserStore from "./user";
import User from "../game/user";
import Player from "../game/player";
import Game from "../game/game";

const playerStore = new PlayerStore();
const gameStore = new GameStore();
const userStore = new UserStore();

export {
  playerStore,
  gameStore,
  userStore,
  User,
  Player,
  Game
};
