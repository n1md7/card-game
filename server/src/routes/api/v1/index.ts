import Router from '@koa/router';
import userRouter from './users';
import authRouter from './auth';
import roomRouter from './games';

const apiRoute = new Router();
const combineApiRoutes = [
  userRouter.routes(),
  roomRouter.routes(),
  authRouter.routes(),
];
apiRoute.use('/v1', ...combineApiRoutes);

export default apiRoute;
