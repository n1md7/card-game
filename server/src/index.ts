import {router} from "./httpServer";
import {v4 as uuidv4} from "uuid";

type PlayerProps = {
    id?: string;
    signUpTime?: number;
    updateTime?: number;
    name?: string;
    roomId?: string;
}

abstract class BaseSetup {
    protected players: Map<string, PlayerProps> = new Map();

    protected signIn(playerId: string): null | PlayerProps {
        const player = this.players.get(playerId);
        if (player) {
            player.updateTime = new Date().valueOf();
            this.players.set(playerId, player);
            return player;
        }
        return null;
    }

    protected signUp(name: string): PlayerProps {
        const id = `P-${uuidv4().substring(0, 5)}`;
        const player = {
            id,
            name,
            updateTime: new Date().valueOf(),
            signUpTime: new Date().valueOf()
        };
        // save player
        this.players.set(id, player);

        return player;
    }
}

class GameSetup extends BaseSetup {

    public status(ctx: any) {
        ctx.body = {
            status: "up"
        }
    }

    public authenticate(ctx: any) {
        const id = ctx.params.id;
        if (id) {
            const player = this.signIn(id);
            if (player) {
                ctx.body = {
                    player,
                    ok: true
                };
            }

            return;
        }

        ctx.body = {
            ok: false,
            msg: 'No such user'
        };
    }

    public register(ctx: any) {
        const name = ctx.params.name;
        if (name) {
            ctx.body = {
                player: this.signUp(name),
                ok: true
            }

            return;
        }

        ctx.body = {
            ok: false,
            msg: 'Name is empty'
        };
    }
}

const gameSetup = new GameSetup();

// To check server status
router.get('/status-check', () => gameSetup.status);
router.get('/authenticate/:id', ctx => gameSetup.authenticate(ctx));
router.get('/register/:name', ctx => gameSetup.register(ctx));


router.get('/lol/:id?', ctx => {
    console.dir(ctx.response.body);
    console.dir(ctx.params);

    ctx.body = {
        yo: 'got it'
    };
});