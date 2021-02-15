import {token} from "../config";
import {id as Id} from "../helpers/ids";
import {Context} from "../types";
import BaseController from "./BaseController";
import AuthModel from "../model/AuthModel";

class AuthController extends BaseController {

  public status = (ctx: Context) => {
    super.clientReturn(ctx, {
      status: "up",
    });
  }

  public userVerified = (ctx: Context) => {
    super.clientReturn(ctx);
  }

  // TODO: add session extend functionality
  public refresh = (ctx: Context) => {
    super.clientReturn(ctx, {
      message: 'TODO: session extend',
    });
  }

  public init = (ctx: Context) => {
    const userId = Id.user();
    const jwToken = Id.jwt({[token.userId]: userId});
    AuthModel.signUp(userId, null);
    super.clientReturn(ctx, {
      [token.self]: jwToken,
      userId,
    });
  }

}

export default new AuthController();
