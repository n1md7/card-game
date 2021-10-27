import { userStore } from '../store';
import User from '../game/User';

class AuthModel {
  public signIn(id: string, name?: string | null): null | User {
    const user = userStore.getById(id);
    if (user) {
      return user;
    }

    return null;
  }

  public signUp(id: string, name: string | null): User {
    return userStore.setById(id, new User(id, name));
  }
}

export default new AuthModel();
