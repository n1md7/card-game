import Player from './Player';

class User {
  public id: string;
  public name: string;
  public gameId: string;
  public player: Player;
  public socketId: string;
  public signUpTime: Date;
  public updateTime: Date;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.signUpTime = new Date();
    this.updateTime = new Date();
  }
}

export default User;
