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
        users: UsersProps;
        size: RoomSizeProps;
        public: IsPublicProps;
    }
};

export class SetupGame {
    public socket: any;
    private rooms: RoomsProps;
    private users: {
        [id: string]: {
            room: string
        };
    };

    constructor() {
        this.rooms = {};
    }

    createRoom() {
        console.log('create room', this.socket?.id)
        const roomId = `roomId{${uuidv4()}}`;
        // Register new room and join
        this.socket.join(roomId);
        // Append to rooms object new room
        this.rooms = {
            ...this.rooms,
            ...{
                [roomId]: {
                    users: {
                        [this.socket.id]: {
                            name: this.socket.id
                        }
                    },
                    size: 3,
                    public: true
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
    }

    joinRoom(roomId: string) {
        this.socket.join(roomId);
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
        delete this.rooms[room].users[userId];
        // remove from the users
        delete this.users[userId];
        console.log('users');
        console.dir(this.users);
        console.log('rooms');
        console.dir(this.rooms);
    }
}
