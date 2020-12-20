import { Context } from "../types";
import BaseController from "./BaseController";
import UserModel from "../model/UserModel";
import { isset } from "../helpers/extras";

class UserController extends BaseController {

  public userInfo( ctx: Context ) {
    const { id } = ctx.state.user;
    try {
      if ( !isset( id ) ) {
        throw new Error( 'Id does not exist in this context' );
      }
      const user = UserModel.getUserInfoById( id );

      return super.clientReturn( ctx, { user } );
    } catch ( { message } ) {

      return super.clientReject( ctx, message );
    }
  }

}

export default new UserController();
