import { router, httpServer } from "./httpServer";
import gameSetup from "./controller/gameSetup";
import auth from "./middleware/auth";

router.get( '/init', ctx => gameSetup.init( ctx ) );
router.get( '/status-check', auth, ctx => gameSetup.status( ctx ) );
router.get( '/show-rooms', auth, ctx => gameSetup.showRooms( ctx ) );
router.get( '/leave-room', auth, ctx => gameSetup.leaveRoom( ctx ) );
router.get( '/user-info', auth, ctx => gameSetup.getUserInfo( ctx ) );

router.get( '/create-room', auth, ctx => gameSetup.create( ctx ) );
router.get( '/join-room', auth, ctx => gameSetup.joinRoom( ctx ) );

router.post( '/create-room', auth, ctx => gameSetup.create( ctx ) );
router.post( '/join-room', auth, ctx => gameSetup.joinRoom( ctx ) );

export {
  router,
  httpServer
}
