import dotenv from "dotenv";

dotenv.config();

import config from "./config";
import Server from "./server";

// Start Koa server
export const server = new Server(config);
server.init();
server.startServer();
server.startSocket();


