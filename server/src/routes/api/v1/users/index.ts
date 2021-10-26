import Router from '@koa/router';
import UserController from '../../../../controller/v1/UserController';
import handleAuthentication from '../../../../middleware/handleAuthVerification';

const userRouter = new Router();

userRouter.use('/user', handleAuthentication);

userRouter.get('/user', UserController.getUserInfo);

export default userRouter;
