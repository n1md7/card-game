import Router from '@koa/router';
import AuthController from '../../controller/AuthController';
import auth from '../../middleware/auth';
import GameController from '../../controller/GameController';
import UserController from '../../controller/UserController';

const router = new Router();
// TODO: Refactor this and move in versioned endpoint
router.get('/init', AuthController.init);
router.get('/extend', AuthController.refresh);
router.get('/status-check', auth, AuthController.status);
router.get('/show-rooms', auth, GameController.showAll);
router.get('/leave-room', auth, GameController.leave);
router.get('/user-info', auth, UserController.userInfo);

router.post('/create-room', auth, GameController.create);
router.post('/join-room', auth, GameController.join);


export default router;