import BaseStore, { Storage } from "./baseStore";
import User from "../game/user";

export default class UserStore extends BaseStore<User> {
  constructor( defaultData: Storage<User> = {} ) {
    super( defaultData );
  }
}
