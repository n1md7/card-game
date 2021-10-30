import authModel from '../../../model/AuthModel';
import userModel from '../../../model/UserModel';
import playerModel from '../../../model/PlayerModel';
import { gameStore, playerStore, userStore } from '../../../store';
import Player from '../../../game/Player';

describe('Test authModel CRUD operations', () => {
  const userId = 'U-345f';
  const roomId = 'R-402h';
  const userName = 'Giorgi';
  const size = 4;
  const isPublic = true;

  beforeEach(() => {
    userStore.clearStorage();
    playerStore.clearStorage();
    gameStore.clearStorage();
  });

  it('should fail because there is no user yet', () => {
    const signIn = authModel.signIn(userId, userName);
    expect(signIn).toBeNull();
  });

  it('should signUp a new user', () => {
    const signUp = authModel.signUp(userId, userName);
    expect(signUp).toEqual(
      expect.objectContaining({
        name: userName,
        id: userId,
        signUpTime: expect.any(Date),
        updateTime: expect.any(Date),
      }),
    );
  });

  it('should signIn successfully', () => {
    const signUp = authModel.signUp(userId, userName);
    const signIn = authModel.signIn(userId, userName);
    expect(signIn).toEqual(
      expect.objectContaining({
        id: userId,
        name: userName,
        signUpTime: expect.any(Date),
        updateTime: expect.any(Date),
      }),
    );
  });

  it('should fail with the exception message when no user found', () => {
    const tmpUsrId = 'U-11111';
    expect(() => userModel.getUserInfoById(tmpUsrId)).toThrowError(`could not find a user with the id:${tmpUsrId}`);
  });

  it('should return user data', () => {
    const signUp = authModel.signUp(userId, userName);
    const user = userModel.getUserInfoById(signUp.id);

    expect(user).toEqual(
      expect.objectContaining({
        id: userId,
        name: userName,
        signUpTime: expect.any(Date),
        updateTime: expect.any(Date),
      }),
    );
  });

  it('should return all user store', () => {
    authModel.signUp('userId-1', userName);
    authModel.signUp('userId-2', userName);
    expect(userStore.getStorage()).toEqual(userModel.getUsers());
  });

  it('should add a new player', () => {
    const user = authModel.signUp(userId, userName);
    const player = new Player(user.id, userName);
    playerModel.addPlayer(player, user.id);
    expect(playerStore.getStorage()).toEqual({
      [user.id]: expect.objectContaining({
        cards: expect.any(Array),
        name: userName,
        playerGameId: null,
        playerId: user.id,
        takenCards: expect.any(Array),
      }),
    });
  });
});
