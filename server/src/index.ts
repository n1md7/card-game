import dotenv from "dotenv";

dotenv.config();

import config from "./config";
import Server from "./server";
import connection from "./connection";

(async () => {
  await connection.authenticate();
  await connection.sync();
})();
// Start Koa server
const koa = new Server(config);
koa.init();
koa.startServer();
koa.startSocket();

export default koa;


