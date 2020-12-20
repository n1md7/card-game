import PlayerStore from "./PlayerStore";
import GameStore from "./GameStore";
import UserStore from "./UserStore";
import User from "../game/User";
import Player from "../game/Player";
import Game from "../game/Game";

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
