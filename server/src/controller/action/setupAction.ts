import {store, RoomProps, UserProps} from "../../store";

class SetupAction {

    public signIn(id: string, name: string | undefined): null | UserProps {
        const user = store.getUserById(id);
        if (user) {
            return store.updateUserById(id, {
                updateTime: new Date().valueOf(),
                name
            });

        }
        return null;
    }

    public signUp(id: string, name: string): UserProps {
        return store.setUserById(id, {
            name
        });
    }

    public createRoom({userId, roomId, size, isPublic}: {
        userId: string;
        roomId: string;
        size: number;
        isPublic: boolean;
    }): RoomProps | Error {
        const creator = store.getUserById(userId);
        if(!creator){
            throw new Error(`no such user with the id:${userId}`);
        }
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

    public joinRoom({id, userId}: {
        id: string;
        userId: string;
    }): RoomProps | boolean {
        const room = store.getRoomById(id);
        if (!room || 1 + room.inRoomSize > room.size) {
            // cannot join the room
            // because it is already full
            // or does not exist such room
            return false;
        }

        return store.updateRoomById(id, {
            users: [...room.users, userId],
            inRoomSize: 1 + room.inRoomSize
        });
    }
}

export default new SetupAction();
