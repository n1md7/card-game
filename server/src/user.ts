import Player from "./game/player";

class User {
  public id: string;
  public name: string;
  public player: Player;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}


export default User;