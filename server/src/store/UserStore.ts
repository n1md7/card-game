import BaseStore, { Storage } from "./BaseStore";
import User from "../game/User";

export default class UserStore extends BaseStore<User> {
  constructor( defaultData: Storage<User> = {} ) {
    super( defaultData );
  }
}
