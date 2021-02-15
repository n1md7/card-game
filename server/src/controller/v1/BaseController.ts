import {Context} from '../../types';

export default abstract class BaseController {

  public status = async (ctx: Context): Promise<void> => {
    ctx.body = {
      status: "up",
      version: process.env.VERSION || '1.0.0',
    };
  }

}
