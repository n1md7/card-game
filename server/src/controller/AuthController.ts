import { room as Room, token } from "../config";
import { id as Id } from "../helpers/ids";
import { Context } from "../types";
import BaseController from "./BaseController";
import PlayerModel from "../model/PlayerModel";
import GameModel from "../model/GameModel";
import AuthModel from "../model/AuthModel";
import UserModel from "../model/UserModel";

class AuthController extends BaseController {

  public status( ctx: Context ) {
    super.clientReturn( ctx, {
      status: "up"
    } );
  }
  // TODO: add session extend functionality
  public refresh( ctx: Context ) {
    super.clientReturn( ctx, {
      message: 'TODO: session extend'
    } );
  }

  public init( ctx: Context ) {
    const userId = Id.user();
    const jwToken = Id.jwt( { [ token.userId ]: userId } );
    AuthModel.signUp( userId, null );
    super.clientReturn( ctx, {
      [ token.self ]: jwToken,
      userId
    } );
  }

}

export default new AuthController();
