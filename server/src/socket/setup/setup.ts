import {v4 as uuidv4} from "uuid";

type UsersProps = {
    [user: string]: {
        name?: string;
    }
}

type RoomSizeProps = 1 | 2 | 3 | 4;
type IsPublicProps = true | false;

type RoomsProps = {
    [roomId: string]: {
        name: string;
        users: UsersProps;
        size: RoomSizeProps;
        isPublic: IsPublicProps;
    }
};

export class SetupGame {
    public socket: any;
    public io: any;
    private rooms: RoomsProps;
    private users: {
        [id: string]: {
            room: string
        };
    };

    constructor() {
        this.rooms = {};
    }

    createRoom(name: string) {
        console.log('create room', this.socket?.id)
        const roomId = `roomId{${uuidv4()}}`;
        // Register new room and join
        this.socket.join(roomId);
        // Append to rooms object new room
        this.rooms = {
            ...this.rooms,
            ...{
                [roomId]: {
                    name,
                    users: {
                        [this.socket.id]: {
                            name
                        }
                    },
                    size: 3,
                    isPublic: true
                }
            }
        };
        // Record new User and it's table
        this.users = {
            ...this.users,
            ...{
                [this.socket.id]: {
                    room: roomId
                }
            }
        };

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

    joinRoom(roomId: string, name:string) {
        this.socket.join(roomId);
        // Append to rooms object new user
        if(this.rooms[roomId]){
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
        this.users = {
            ...this.users,
            ...{
                [this.socket.id]: {
                    room: roomId
                }
            }
        };

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

    showRooms() {
        this.socket.emit('client:get-rooms-list', {
            socketRooms: this.socket.rooms,
            gameRooms: this.rooms
        });
    }

    disconnect() {
        const {id: userId} = this.socket;
        console.log(`A user ${userId} disconnected`);
        // find room from where user has been disconnected
        const {room} = this.users[userId];
        // remove the user from rooms list
        if (this.rooms[room]?.users[userId]) {
            delete this.rooms[room].users[userId];
        }
        // remove from the users
        if (this.users[userId]) {
            delete this.users[userId];
        }

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
