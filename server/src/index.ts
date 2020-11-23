import dotenv from "dotenv";

dotenv.config();

import {
  router,
  httpServer
} from "./httpServer";
import "./route";
import "./socket";

export {
  router,
  httpServer
}
