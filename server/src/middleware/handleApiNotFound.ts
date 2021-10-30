import Koa, { Context, Next } from 'koa';
import { HttpCode, HttpText } from '../types/errorHandler';
import { KoaEvent } from '../types';

export default (apiContextPath: string, koa: Koa) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    if (ctx.path.indexOf(apiContextPath) !== -1) {
      // Request came to api endpoint
      ctx.status = HttpCode.notFound;
      ctx.body = {
        code: HttpCode.notFound,
        message: HttpText.notFound,
      };
      koa.emit(KoaEvent.serverError, `${ctx.request.path} - is not a valid route!`);
    } else {
      await next();
    }
  };
};
