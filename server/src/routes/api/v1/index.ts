import Router from '@koa/router';
import userRouter from './users';
import authRouter from './auth';
import roomRouter from './games';
import GameController from '../../../controller/v1/GameController';
import { Env } from '../../../types';

const apiRoute = new Router();
const combineApiRoutes = [userRouter.routes(), roomRouter.routes(), authRouter.routes()];
if (process.env.NODE_ENV !== Env.Prod) {
  const developmentRoutes = new Router();
  developmentRoutes.get('/storage', GameController.showStoreData);
  combineApiRoutes.push(developmentRoutes.routes());
}
apiRoute.use('/v1', ...combineApiRoutes);

export default apiRoute;
