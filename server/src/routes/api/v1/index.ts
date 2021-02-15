import Router from '@koa/router';
import userRouter from './users';

const apiRoute = new Router();
const combineApiRoutes = [
    userRouter.routes(),
];
apiRoute.use('/v1', ...combineApiRoutes);

export default apiRoute;
