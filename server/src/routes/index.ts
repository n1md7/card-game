import Router from "@koa/router";
import {ConfigOptions} from "../types/config";
import apiV1Router from "./api/v1";

export default (config: ConfigOptions): Router => {

  const router = new Router();
  const combineRoutes = [
    apiV1Router.routes(),
  ];
  // add api endpoints
  router.use(config.server.apiContextPath, ...combineRoutes);

  return router;
};
