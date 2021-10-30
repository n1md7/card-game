import { Token } from 'shared-types';
import { id } from '../../helpers/ids';
import { Context } from '../../types';
import AuthModel from '../../model/AuthModel';
import AuthInterface from './interfaces/AuthInterface';
import BaseController from './BaseController';

class AuthController extends BaseController implements AuthInterface {
  public userVerified = async (ctx: Context): Promise<void> => {
    ctx.status = 200;
  };

  // TODO: add session extend functionality
  public getNewJsonWebToken = async (ctx: Context): Promise<void> => {
    ctx.body = 'TODO: session extend';
  };

  public getInitialJsonWebToken = async (ctx: Context): Promise<void> => {
    const userId = id.user();
    const jsonWebToken = id.jwt({ [Token.userId]: userId });
    AuthModel.signUp(userId, null);

    ctx.body = {
      [Token.auth]: jsonWebToken,
      userId,
    };
  };
}

export default new AuthController();
