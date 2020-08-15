import {RoomSizeProps} from "../../types";
import socketIO from "socket.io";
import {httpServer} from "../../httpServer";
import {SetupGame} from "./setup";

// Pass a http.Server instance to the listen method
const io = socketIO(httpServer, {
    cookie: 'mycookie'
});

// Create game setup instance
const setup = new SetupGame();

io.on('connection', function (socket: any) {
    console.log("A user is connected successfully to the socket ...");
    console.log('Current socket ID: ', socket.id)
    // pass the socket reference
    setup.socket = socket;
    setup.io = io;
    socket.on('do:sign-in', (data: {
        id: string | null;
        name: string;
    }) => setup.authOrRegisterUser(data));
    socket.on('do:create-room', (data: {
        name: string;
        size: RoomSizeProps;
        isPublic: boolean;
    }) => setup.createRoom(data));
    socket.on('do:join-room', (roomId: string, name: string) => setup.joinRoom(roomId, name));
    socket.on('do:get-rooms-list', () => setup.showRooms());
    socket.on('disconnect', () => setup.disconnect())
});
