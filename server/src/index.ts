import { router, httpServer } from "./httpServer";
import gameController from "./controller/gameController";
import auth from "./middleware/auth";

router.get( '/init', ctx => gameController.init( ctx ) );
router.get( '/extend', ctx => {
  ctx.body = {
    message: 'TODO: session extend'
  }
} );
router.get( '/status-check', auth, ctx => gameController.status( ctx ) );
router.get( '/show-rooms', auth, ctx => gameController.showRooms( ctx ) );
router.get( '/leave-room', auth, ctx => gameController.leaveRoom( ctx ) );
router.get( '/user-info', auth, ctx => gameController.getUserInfo( ctx ) );

router.post( '/create-room', auth, ctx => gameController.create( ctx ) );
router.post( '/join-room', auth, ctx => gameController.joinRoom( ctx ) );

export {
  router,
  httpServer
}
