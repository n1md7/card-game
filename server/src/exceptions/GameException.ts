import { ErrorType } from '../types/error';

export default class GameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = ErrorType.gameError;
  }
}
