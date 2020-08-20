import setup from "../model/setup";
import {store} from "../store";

import {room as Room} from "../config";
import {id as Id} from "../helpers/ids";
import {Context} from "../types";

class GameSetup {
    public status(ctx: Context) {
        ctx.body = {
            status: "up"
        };
    }

    public create(ctx: Context) {
        const roomId = Id.room();
        const userId = ctx.state.user.id;
        const {isPublic, size, name} = ctx.request.body;
        const roomSizes = [Room.two, Room.three, Room.four];

        if (!roomSizes.includes(size)) {
            ctx.body = {
                msg: `allowed sizes are for the room are ${roomSizes}`,
                ok: false
            }

            return;
        }

        if ([null, undefined].includes(isPublic)) {
            // isPublic can be 0 or false so checking explicitly
            ctx.body = {
                msg: 'isPublic param is required',
                ok: false
            }

            return;
        }

        if (!name) {
            ctx.body = {
                msg: 'name param is required',
                ok: false
            }

            return;
        }

        // update user name field
        setup.updateUserById(userId, name);

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

    public showRooms(ctx: Context) {
        ctx.body = {
            ok: true,
            rooms: store.getRoomsList()
        };
    }

    public joinRoom(ctx: Context) {
        const {id, name} = ctx.request.body;
        // user id is always set from the auth middleware
        const userId = ctx.state.user.id;
        if (!id) {
            ctx.body = {
                msg: 'required param [id] is missing',
                ok: false
            }

            return;
        }

        if (!name) {
            ctx.body = {
                msg: 'name param is required',
                ok: false
            }

            return;
        }

        // update user name field
        setup.updateUserById(userId, name);

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

    public leaveRoom(ctx: Context) {
        const {id} = ctx.state.user;

        try {
            // user leaves the room
            setup.leaveRoom(id);
        } catch ({message}) {
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

    public getUserInfo(ctx: Context) {
        const {id} = ctx.state.user;
        let user = {};
        try {
            user = setup.getUserInfo(id);
        } catch ({message}) {
            ctx.body = {
                ok: false,
                msg: message
            };

            return;
        }

        ctx.body = {
            user
        };

    }

}

export default new GameSetup();