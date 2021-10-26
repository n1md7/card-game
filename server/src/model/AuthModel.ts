import { userStore, playerStore } from '../store';
import '../helpers/index';
import Player from '../game/Player';
import User from '../game/User';

class AuthModel {
  public signIn(id: string, name?: string | null): null | Player {
    const user = playerStore.getById(id);
    if (user && !name) {
      return user;
    }

    return null;
  }

  public signUp(id: string, name: string | null): User {
    return userStore.setById(id, new User(id, name));
  }
}

export default new AuthModel();
