import {router, httpServer} from "./httpServer";
import gameSetup from "./controller/gameSetup";

router.get('/init', ctx => gameSetup.init(ctx));
router.get('/status-check', ctx => gameSetup.status(ctx));
router.get('/show-rooms', ctx => gameSetup.showRooms(ctx));
router.get('/leave-room', ctx => gameSetup.leaveRoom(ctx));
router.get('/user-info', ctx => gameSetup.getUserInfo(ctx));

router.post('/create-room', ctx => gameSetup.create(ctx));
router.post('/join-room', ctx => gameSetup.joinRoom(ctx));

export {
    router,
    httpServer
}
