import Player from "./game/player";
import Game from "./game/game";
import User from "./user";

class Store {
  private users: { [ id: string ]: User } = {/**/ };
  private players: { [ id: string ]: Player } = {/**/ };
  private games: { [ id: string ]: Game } = {/**/ };


  public addPlayerToken( player: Player, userId: string ) {
    try {
      this.users[ userId ].player = player;
    } catch ( ex ) {
    }
  }

  public setUserById( id: string, user: User ): User {
    return this.users[ id ] = user;
  }

  public getUserById( id: string ): User {
    return this.users[ id ];
  }

  public getPlayerById( id: string ): Player {
    return this.players[ id ];
  }

  public getGameById( id: string ): Game {
    return this.games[ id ];
  }

  public setGameById( id: string, game: Game ): Game {
    return this.games[ id ] = game;
  }

  public setPlayerById( id: string, player: Player ): Player {
    // except id, signUpTime and updateTime
    // all should be passed
    return this.players[ id ] = player;
  }

  public updateGameById( id: string, player: Player ): Player {
    // when such id does not exist
    // it will create new record for that
    // except id and signUpTime and updateTime all can be updated
    return this.players[ id ] = player;
  }

  /*   public updatePlayerById(id: string, gameId: string): Player {
         // when such id does not exist
         // it will create new record for that
         // except id and signUpTime and updateTime all can be updated

         return this.players[id] = new Player();
     }*/

  public getGamesList() {
    return Object.values( this.games ).map( ( game: Game ) => game.getGameData() );
  }

  public getPlayersList() {
    return this.players;
  }

  public clearGames() {
    this.games = {};
  }

  public clearPlayers() {
    this.players = {};
  }
}

const store = new Store();

export {
  store
}