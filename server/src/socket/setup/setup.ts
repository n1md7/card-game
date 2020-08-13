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

export class SetupGame {
    public socket: any;
    public io: any;
    private rooms: RoomsProps;
    private users: Map<string, { room: string }> = new Map();

    constructor() {
        this.rooms = {};
    }

    public createRoom({name, size, isPublic}: CreateRoomProps) {
        this.disconnectUserFromPreviousRoom();
        console.log('create room', this.socket?.id)
        const roomId = `roomId{${uuidv4()}}`;
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
        console.log(`A user ${userId} disconnected`);
        // find room from where user has been disconnected
        if (this.users.has(userId)) {

            const {room: roomId} = this.users.get(userId);
            // remove the user from rooms list
            if (this.rooms[roomId]?.users[userId]) {
                delete this.rooms[roomId].users[userId];
            }
            // remove from the users
            this.users.delete(userId);
        }
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
