import dotenv from "dotenv";

dotenv.config();

import {
  router,
  httpServer,
  io
} from "./httpServer";
import "./route";
import $Socket from "./socket";
import SocketManager from "./socket/manager";
import activateRoutes from "./route";

activateRoutes( router );

const socket = new $Socket( io );
const socketManager = new SocketManager(io);
socket.connectionHandler();
socket.sendUpdatesEvery( 100 )( "milliseconds" );

export {
  router,
  httpServer,
  socketManager
}
