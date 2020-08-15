import {v4 as uuidv4} from "uuid";
import BaseSetup from "./abstract/baseSetup";
import {store} from "../store";

enum cookie {
    name = 'user-id'
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
        if (!name) {

            ctx.body = {
                ok: false,
                msg: 'name is empty'
            };

            return;
        }

        if (id) {
            const user = this.signIn(id, name);
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
            user: this.signUp(newId, name),
            ok: true
        }

    }

    public create(ctx: any) {
        const roomId = `R-${uuidv4().substring(0, 5)}`;
        const userId = ctx.cookies.get(cookie.name);
        const {isPublic, size} = ctx.params;

        this.createRoom({
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
}

export default new GameSetup();