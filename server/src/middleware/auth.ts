import {cookie} from "../config";
import {Context, Next} from "koa";
import {id} from "../helpers/ids";
import setup from "../model/setup";

export default async (ctx: Context, next: Next) => {
    // get cookie value
    let userId = ctx.cookies.get(cookie.userId);
    let user = setup.signIn(userId);
    if (!userId || !user) {
        // set new cookie since no such user in store or cookie
        userId = id.user();
        ctx.cookies.set(cookie.userId, userId);
        // register new user
        user = setup.signUp(userId, null);
    }

    ctx.state.user = {
        id: userId,
        name: user.name
    };

    await next();
};