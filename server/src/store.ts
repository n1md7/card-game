import Player from "./game/player";
import Game from "./game/game";

class Store {
    private users: { [id: string]: string } = {/**/};
    private players: { [id: string]: Player } = {/**/};
    private games: { [id: string]: Game } = {/**/};


    public setUserById(id: string, user: string): string {
        // except id, signUpTime and updateTime
        // all should be passed
        return this.users[id] = user;
    }

    public getPlayerById( id: string): Player {
        return this.players[id];
    }

    public getGameById( id: string): Game {
        return this.games[id];
    }

    public setGameById(id: string, game: Game): Game {
        return this.games[id] = game;
    }

    public setPlayerById(id: string, player: Player): Player {
        // except id, signUpTime and updateTime
        // all should be passed
        return this.players[id] = player;
    }

    public updateGameById(id: string, player: Player): Player {
        // when such id does not exist
        // it will create new record for that
        // except id and signUpTime and updateTime all can be updated
        return this.players[id] = player;
    }

 /*   public updatePlayerById(id: string, gameId: string): Player {
        // when such id does not exist
        // it will create new record for that
        // except id and signUpTime and updateTime all can be updated

        return this.players[id] = new Player();
    }*/

    public getGamesList(){
        return this.games;
    }

    public getPlayersList(){
        return this.players;
    }

    public clearGames(){
        this.games = {};
    }

    public clearPlayers(){
        this.players = {};
    }
}

const store = new Store();

export {
    store
}