import Koa, {Context, Next} from 'koa';
import {HttpCode, HttpText} from '../types/errorHandler';

export default (apiContextPath: string, koa: Koa) => {
  return async (ctx: Context, next: Next) => {
    if (ctx.path.indexOf(apiContextPath) !== -1) {
      // Request came to api endpoint
      ctx.status = HttpCode.notFound;
      ctx.body = {
        code: HttpCode.notFound,
        message: HttpText.notFound,
      };
      koa.emit("error:server", `${ctx.request.path} - is not a valid route!`);
    } else {
      await next();
    }

  }
};