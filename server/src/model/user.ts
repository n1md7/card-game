import { userStore, User } from "../store/index";
import BaseModel from "./baseModel";

class UserModel extends BaseModel<User>{
  public getUserInfo( userId: string ) {
    const user = userStore.getById( userId );
    if ( !user ) {
      throw new Error( `could not find a user with the id:${ userId }` );
    }

    return user;
  }

  public getUsers(){
    return userStore.getStorage();
  }

}

export default new UserModel(userStore);
