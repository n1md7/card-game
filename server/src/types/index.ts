import {Context} from "koa";

interface SocketCallback {
    message: any
}

type RoomSizeProps = 2 | 3 | 4;

/*
* extends Koa context with custom state props
* */
interface MyContext extends Context {
    state: {
        user: {
            id: string;
            name: string;
        }
    }
}


export {
    RoomSizeProps,
    SocketCallback,
    MyContext as Context
}
