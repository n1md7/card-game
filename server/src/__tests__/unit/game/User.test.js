import { id } from '../../../helpers/ids';
import User from '../../../game/User';

describe('User test', function () {
  it('should set initial properties accordingly', function () {
    const userId = id.user();
    const user = new User(userId, 'Badass');
    expect(user).toEqual({
      id: userId,
      name: 'Badass',
    });
  });

  it('should set public properties accordingly', function () {
    const userId = id.user();
    const gameId = id.game();
    const playerId = id.player();
    const user = new User(userId, 'Badass');
    user.gameId = gameId;
    user.socketId = '123';
    expect(user).toEqual({
      id: userId,
      name: 'Badass',
      gameId: gameId,
      socketId: '123',
    });
  });
});
