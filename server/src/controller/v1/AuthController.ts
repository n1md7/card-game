import {token} from "../../config";
import {id as Id} from "../../helpers/ids";
import {Context} from "../../types";
import AuthModel from "../../model/AuthModel";
import Auth from './Auth';
import BaseController from './BaseController';


class AuthController extends BaseController implements Auth {

  public userVerified = async (ctx: Context): Promise<void> => {
    ctx.status = 200;
  }

  // TODO: add session extend functionality
  public getNewJsonWebToken = async (ctx: Context): Promise<void> => {
    ctx.body = 'TODO: session extend';
  }

  public getInitialJsonWebToken = async (ctx: Context): Promise<void> => {
    const userId = Id.user();
    const jwt = Id.jwt({[token.userId]: userId});
    AuthModel.signUp(userId, null);

    ctx.body = {
      [token.self]: jwt,
      userId,
    };
  }

}

export default new AuthController();
