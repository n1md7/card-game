import Router from "@koa/router";
import handleAuthentication from '../../../../middleware/handleAuthVerification';
import GameController from '../../../../controller/v1/GameController';

const roomRouter = new Router();

roomRouter.use('/game', handleAuthentication);

roomRouter.get('/games', GameController.getAllPublicGames);
roomRouter.put('/game/exit', GameController.exitGame);
roomRouter.post('/game/create', GameController.createGame);
roomRouter.post('/game/enter', GameController.enterGame);

export default roomRouter;
