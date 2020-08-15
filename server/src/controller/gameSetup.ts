import {v4 as uuidv4} from "uuid";
import setup from "../model/setup";
import {store} from "../store";

enum cookie {
    name = 'user-id'
}

class GameSetup {
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
            const user = setup.signIn(id, name);
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
            user: setup.signUp(newId, name),
            ok: true
        }

    }

    public create(ctx: any) {
        const roomId = `R-${uuidv4().substring(0, 5)}`;
        const userId = ctx.cookies.get(cookie.name);
        const {isPublic, size} = ctx.params;

        if (!isPublic || !size || !userId) {
            ctx.body = {
                msg: 'required params are missing',
                ok: false
            }

            return;
        }

        try {
            setup.createRoom({
                userId,
                roomId,
                isPublic: !!isPublic,
                size: +size
            });
        } catch ({message}) {
            ctx.body = {
                msg: message,
                ok: false
            }

            return;
        }

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
        if (!id || !userId) {
            ctx.body = {
                msg: 'required params [id or userId] are missing',
                ok: false
            }

            return;
        }

        let room = {};
        try {
            room = setup.joinRoom({id, userId});
        } catch ({message}) {
            ctx.body = {
                ok: false,
                msg: message
            };

            return;
        }

        ctx.body = {
            ok: true,
            room
        };

    }

    public leaveRoom(ctx: any) {
        const userId = ctx.cookies.get(cookie.name);
        if (!userId) {
            ctx.body = {
                msg: 'required param [userId] is missing',
                ok: false
            }

            return;
        }

        try {
            setup.leaveRoom(userId);
        }catch ({message}) {
            ctx.body = {
                ok: false,
                msg: message
            };

            return;
        }

        ctx.body = {
            ok: true
        };

    }
}

export default new GameSetup();