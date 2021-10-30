import { Context } from '../../types';
import UserModel from '../../model/UserModel';
import BaseController from './BaseController';
import UserInterface from './interfaces/UserInterface';

class UserController extends BaseController implements UserInterface {
  public getUserInfo = async (ctx: Context): Promise<void> => {
    ctx.body = UserModel.getUserInfoById(ctx.state.user?.id);
  };
}

export default new UserController();
