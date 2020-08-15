import {v4 as uuidv4} from "uuid";
import setupAction from "./action/setupAction";
import {store} from "../store";

enum cookie {
    name = 'user-id'
}

class GameSetup {
    private action = setupAction;

    public status(ctx: any) {
        ctx.body = {
            status: "up"
        };
    }

    public authenticate(ctx: any) {
        const id = ctx.cookies.get(cookie.name);
        const {name} = ctx.params;
        if (!name) {

            ctx.body = {
                ok: false,
                msg: 'name is empty'
            };

            return;
        }

        if (id) {
            const user = this.action.signIn(id, name);
            if (user) {
                // sign-in successful
                ctx.body = {
                    user,
                    ok: true
                };

                return;
            }
        }

        // or sign-up new user
        const newId = `U-${uuidv4().substring(0, 5)}`;
        ctx.cookies.set(cookie.name, newId);
        ctx.body = {
            user: this.action.signUp(newId, name),
            ok: true
        }

    }

    public create(ctx: any) {
        const roomId = `R-${uuidv4().substring(0, 5)}`;
        const userId = ctx.cookies.get(cookie.name);
        const {isPublic, size} = ctx.params;

        this.action.createRoom({
            userId,
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
        ctx.body = {
            ok: true,
            rooms: store.getRoomsList()
        };
    }

    public joinRoom(ctx: any) {
        const {id} = ctx.params;
        const userId = ctx.cookies.get(cookie.name);
        const room = this.action.joinRoom({id, userId});
        if (!room) {
            ctx.body = {
                ok: false,
                msg: 'could not join the room'
            };

            return;
        }

        ctx.body = {
            ok: true,
            room
        };

    }
}

export default new GameSetup();