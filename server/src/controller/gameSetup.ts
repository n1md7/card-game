import {v4 as uuidv4} from "uuid";

enum cookie {
    name = 'player-id'
}

type PlayerProps = {
    id?: string;
    name?: string;
    roomId?: string;
    signUpTime?: number;
    updateTime?: number;
}

type RoomProps = {
    creator: {
        readonly id: string;
        readonly name: string;
    };
    readonly name: string;
    players: string[];
    readonly size: number;
    inRoomSize: number;
    readonly isPublic: boolean;
    readonly id?: string;
    readonly signUpTime?: number;
    updateTime?: number;
};

abstract class BaseSetup {
    protected players: Map<string, PlayerProps> = new Map();
    protected rooms: Map<string, RoomProps> = new Map();

    protected signIn(playerId: string, name: string | undefined): null | PlayerProps {
        const player = this.players.get(playerId);
        if (player) {
            player.updateTime = new Date().valueOf();
            if (name) {
                // if name is passed assign it
                // or use previous one
                player.name = name;
            }
            this.players.set(playerId, player);
            return player;
        }
        return null;
    }

    protected signUp(id: string, name: string): PlayerProps {
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

    protected createRoom({playerId, roomId, size, isPublic}: {
        playerId: string;
        roomId: string;
        size: number;
        isPublic: boolean;
    }) {
        const creator = this.players.get(playerId);
        this.rooms.set(roomId, {
            creator: {
                id: creator.id,
                name: creator.name
            },
            name: creator.name,
            players: [playerId],
            size,
            inRoomSize: 1,
            isPublic,
            id: roomId,
            signUpTime: new Date().valueOf(),
            updateTime: new Date().valueOf()
        });
    }
}

class GameSetup extends BaseSetup {

    public status(ctx: any) {
        ctx.body = {
            status: "up"
        }
    }

    public authenticate(ctx: any) {
        const id = ctx.cookies.get(cookie.name);
        const {name} = ctx.params;
        if (id) {
            const player = this.signIn(id, name);
            if (player) {
                // sign-in successful
                ctx.body = {
                    player,
                    ok: true
                };

                return;
            }
        }

        // or sign-up new user
        const newId = `P-${uuidv4().substring(0, 5)}`;
        ctx.cookies.set(cookie.name, newId);
        if (name) {
            ctx.body = {
                player: this.signUp(newId, name),
                ok: true
            }

            return;
        }

        ctx.body = {
            ok: false,
            msg: 'Name is empty'
        };
    }

    public create(ctx: any) {
        const roomId = `R-${uuidv4().substring(0, 5)}`;
        const playerId = ctx.cookies.get(cookie.name);
        const {isPublic, size} = ctx.params;

        this.createRoom({
            playerId,
            roomId,
            isPublic: !!isPublic,
            size: +size
        });

        ctx.body = {
            roomId,
            ok: true
        }
    }

    public showRooms(ctx: any) {
        console.log('Sending rooms....')
        console.dir(this.rooms)
        ctx.body = {
            ok: true,
            // fixme this is returning an empt array
            rooms: this.rooms
        };
    }
}

export default new GameSetup();