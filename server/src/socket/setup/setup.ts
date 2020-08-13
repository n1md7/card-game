import {v4 as uuidv4} from "uuid";
import {RoomSizeProps} from "../../types";

type UsersProps = {
    [user: string]: {
        name?: string;
    }
}

type IsPublicProps = true | false;

type RoomsProps = {
    [roomId: string]: {
        creator: string;
        users: UsersProps;
        size: RoomSizeProps;
        isPublic: IsPublicProps;
    }
};

type CreateRoomProps = {
    name: string;
    size: RoomSizeProps;
    isPublic: boolean;
};

abstract class BaseSetup {
    public socket: any;
    public io: any;
    protected rooms: RoomsProps;
    protected users: Map<string, {
        room?: string;
        name?: string;
    }> = new Map();

    protected constructor() {
        this.rooms = {};
    }

    protected findUserByRoomId(id: string): string | null {
        for (const [key, {room}] of this.users) {
            if (room === id) {
                return key;
            }
        }

        return null;
    }
}

export class SetupGame extends BaseSetup {

    constructor() {
        super();
    }

    public authOrRegisterUser({id, name}: {
        id: string | null;
        name: string
    }) {
        // Register just user id with an empty body for now
        // We will update it later
        if (id) {
            if (!this.users.has(id)) {
                this.users.set(id, {
                    name
                });
            }
        } else {
            id = `U-${uuidv4().substring(0, 5)}`;
            this.users.set(id, {
                name
            });
        }

        // send echo to the client
        this.socket.emit('client:sign-in', id);
    }

    public createRoom({name, size, isPublic}: CreateRoomProps) {
        this.disconnectUserFromPreviousRoom();
        const roomId = `G-${uuidv4().substring(0, 5)}`;
        // Register new room and join
        this.socket.join(roomId);
        // Append to rooms object new room
        this.rooms = {
            ...this.rooms,
            ...{
                [roomId]: {
                    creator: name,
                    users: {
                        [this.socket.id]: {
                            name
                        }
                    },
                    size,
                    isPublic
                }
            }
        };
        // Record new User and it's table
        this.users.set(this.socket.id, {
            room: roomId
        });

        // emit rooms to the users except the creator
        // this.socket.broadcast.emit('client:get-rooms-list', {
        //     socketRooms: this.socket.rooms,
        //     gameRooms: this.rooms
        // });

        // Emit to all including creator
        // FIXME For testing only
        this.io.emit('client:get-rooms-list', {
            socketRooms: this.socket.rooms,
            gameRooms: this.rooms
        });
    }

    public joinRoom(roomId: string, name: string) {
        this.disconnectUserFromPreviousRoom();
        this.socket.join(roomId);
        // Append to rooms object new user
        if (this.rooms[roomId]) {
            this.rooms[roomId].users = {
                ...this.rooms[roomId].users,
                ...{
                    [this.socket.id]: {
                        name
                    }
                }
            }
        }

        // Record new User
        this.users.set(this.socket.id, {
            room: roomId
        });

        // emit rooms for the rest users except the creator
        // this.socket.broadcast.emit('client:get-rooms-list', {
        //     socketRooms: this.socket.rooms,
        //     gameRooms: this.rooms
        // });

        // Emit to all including creator
        // FIXME For testing only
        this.io.emit('client:get-rooms-list', {
            socketRooms: this.socket.rooms,
            gameRooms: this.rooms
        });
    }

    public showRooms() {
        this.socket.emit('client:get-rooms-list', {
            socketRooms: this.socket.rooms,
            gameRooms: this.rooms
        });
    }

    private disconnectUserFromPreviousRoom() {
        const {id: userId} = this.socket;
        console.log(`v---------------------------------------------v`);
        console.log(`A user ${userId} is about to be disconnected!`);
        // find room from where user has been disconnected
        if (this.users.has(userId)) {

            const {room: roomId} = this.users.get(userId);
            // remove the user from rooms list
            if (this.rooms.hasOwnProperty(roomId)) {
                if (this.rooms[roomId].users.hasOwnProperty(userId)) {
                    console.log(userId, ' is about to remove!')
                    console.dir(this.rooms[roomId].users)
                    delete this.rooms[roomId].users[userId];
                }
            }
            console.log(userId, ' is about to remove!')
            console.dir(this.users)
            // remove from the users
            this.users.delete(userId);
        }
        console.log(`^----------------------------------------------^`);

    }

    public disconnect() {
        this.disconnectUserFromPreviousRoom();
        // emit rooms for the rest users except the creator
        this.socket.broadcast.emit('client:get-rooms-list', {
            socketRooms: this.socket.rooms,
            gameRooms: this.rooms
        });

        console.log('users');
        console.dir(this.users);
        console.log('rooms');
        console.dir(this.rooms);
    }
}
