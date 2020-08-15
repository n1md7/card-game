type UserProps = {
    id?: string;
    name?: string;
    roomId?: string;
    signUpTime?: number;
    updateTime?: number;
}

type RoomProps = {
    creator?: {
        readonly id: string;
        readonly name: string;
    };
    readonly name?: string;
    users?: string[];
    readonly size?: number;
    inRoomSize?: number;
    readonly isPublic?: boolean;
    readonly id?: string;
    readonly signUpTime?: number;
    updateTime?: number;
};

class Store {
    private users: { [id: string]: UserProps } = {/**/};
    private rooms: { [id: string]: RoomProps } = {/**/};

    public getUserById(id: string): UserProps {
        return this.users[id];
    }

    public getRoomById(id: string): RoomProps {
        return this.rooms[id];
    }

    public setRoomById(id: string, room: RoomProps): RoomProps {
        return this.rooms[id] = {
            ...room,
            id,
            inRoomSize: 1,
            signUpTime: new Date().valueOf(),
            updateTime: new Date().valueOf()
        };
    }

    public setUserById(id: string, user: UserProps): UserProps {
        // except id, signUpTime and updateTime
        // all should be passed
        return this.users[id] = {
            ...user,
            id,
            signUpTime: new Date().valueOf(),
            updateTime: new Date().valueOf()
        }
    }

    public updateRoomById(id: string, room: RoomProps): RoomProps {
        // when such id does not exist
        // it will create new record for that
        // except id and signUpTime and updateTime all can be updated
        return this.rooms[id] = {
            ...this.rooms[id],
            ...room,
            id,
            updateTime: new Date().valueOf(),
            signUpTime: this.rooms[id].signUpTime
        };
    }

    public updateUserById(id: string, user: UserProps): UserProps {
        // when such id does not exist
        // it will create new record for that
        // except id and signUpTime and updateTime all can be updated
        return this.users[id] = {
            ...this.users[id],
            ...user,
            id,
            updateTime: new Date().valueOf(),
            signUpTime: this.users[id].signUpTime
        };
    }

    public getRoomsList(){
        return this.rooms;
    }
}

const store = new Store();

export {
    store,
    RoomProps,
    UserProps
}