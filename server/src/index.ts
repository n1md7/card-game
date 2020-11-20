import { router, httpServer } from "./httpServer";
import GameController from "./controller/GameController";
import auth from "./middleware/auth";

router.get( '/init', ctx => GameController.init( ctx ) );
router.get( '/extend', ctx => {
  ctx.body = {
    message: 'TODO: session extend'
  }
} );
router.get( '/status-check', auth, ctx => GameController.status( ctx ) );
router.get( '/show-rooms', auth, ctx => GameController.showRooms( ctx ) );
router.get( '/leave-room', auth, ctx => GameController.leaveRoom( ctx ) );
router.get( '/user-info', auth, ctx => GameController.getUserInfo( ctx ) );

router.post( '/create-room', auth, ctx => GameController.create( ctx ) );
router.post( '/join-room', auth, ctx => GameController.joinRoom( ctx ) );

export {
  router,
  httpServer
}
