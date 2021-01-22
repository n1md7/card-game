import AuthController from "../controller/AuthController";
import auth from "../middleware/auth";
import GameController from "../controller/GameController";
import UserController from "../controller/UserController";
import Router from "koa-router";

export default ( router: Router ) => {
  router.get( '/init', ctx => AuthController.init( ctx ) );
  router.get( '/extend', ctx => AuthController.refresh( ctx ) );
  router.get( '/status-check', auth, ctx => AuthController.status( ctx ) );
  router.get( '/verify-user', auth, ctx => AuthController.userVerified( ctx ) );
  router.get( '/show-rooms', auth, ctx => GameController.showAll( ctx ) );
  router.get( '/leave-room', auth, ctx => GameController.leave( ctx ) );
  router.get( '/user-info', auth, ctx => UserController.userInfo( ctx ) );

  router.post( '/create-room', auth, ctx => GameController.create( ctx ) );
  router.post( '/join-room', auth, ctx => GameController.join( ctx ) );
}
