import dotenv from "dotenv";

dotenv.config();

import {
  router,
  httpServer,
  io
} from "./httpServer";
import "./route";
import $Socket from "./socket";
import activateRoutes from "./route";

activateRoutes( router );

const socket = new $Socket( io );
socket.connectionHandler();
socket.sendUpdatesEvery( 100 )( "milliseconds" );

export {
  router,
  httpServer
}
