import { userStore } from '../store';
import BaseModel from './BaseModel';
import User from '../game/User';

class UserModel extends BaseModel<User> {
  public getUserInfoById(userId: string) {
    const user = userStore.getById(userId);
    if (!user) {
      throw new Error(`could not find a user with the id:${userId}`);
    }

    return user;
  }

  public getUsers() {
    return userStore.getStorage();
  }
}

export default new UserModel(userStore);
