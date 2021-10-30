import Koa, { Context } from 'koa';
import fs from 'fs';
import { KoaEvent } from '../types';

export default (index: string, koa: Koa) => {
  return async (ctx: Context): Promise<void> => {
    try {
      ctx.body = fs.readFileSync(index, 'utf8');
    } catch (error) {
      ctx.body = `
            <h2>Not Found 404</h2>
            <p><b>index.html</b> not found in <b>build</b> folder</p>
            <p>Make sure you run <code>npm run build</code> command</p>
        `;
      ctx.status = 404;
      koa.emit(KoaEvent.serverError, error?.toString());
    }
  };
};
