import Router from '@koa/router';
import AuthController from '../../../../controller/v1//AuthController';
import authVerify from '../../../../middleware/handleAuthVerification';

const authRouter = new Router();

authRouter.get('/auth/init', AuthController.getInitialJsonWebToken);
authRouter.get('/auth/extend', AuthController.getNewJsonWebToken);
authRouter.get('/auth/status', authVerify, AuthController.userVerified);

export default authRouter;
