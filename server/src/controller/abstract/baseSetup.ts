import {store, RoomProps, UserProps} from "../../store";

abstract class BaseSetup {

    protected signIn(id: string, name: string | undefined): null | UserProps {
        const user = store.getUserById(id);
        if (user) {
            return store.updateUserById(id, {
                updateTime: new Date().valueOf(),
                name
            });

        }
        return null;
    }

    protected signUp(id: string, name: string): UserProps {
        return store.setUserById(id, {
            name
        });
    }

    protected createRoom({userId, roomId, size, isPublic}: {
        userId: string;
        roomId: string;
        size: number;
        isPublic: boolean;
    }): RoomProps {
        const creator = store.getUserById(userId);
        return store.setRoomById(roomId, {
            creator: {
                id: creator.id,
                name: creator.name
            },
            name: creator.name,
            users: [userId],
            size,
            isPublic
        });
    }

    protected joinRoom({id, userId}: {
        id: string;
        userId: string;
    }) {

    }
}

export default BaseSetup;