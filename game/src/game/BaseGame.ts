import {GameSelectorType, SocketType} from './types';

export default class BaseGame {
  protected readonly selector: GameSelectorType;
  protected readonly socketIO: SocketType;

  constructor(selector: GameSelectorType, socketIO: SocketType) {
    this.selector = selector;
    this.socketIO = socketIO;
  }
}
