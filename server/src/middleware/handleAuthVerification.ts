import { token } from '../config';
import { Context, Next } from 'koa';
import JsonWebToken from 'jsonwebtoken';
import User from '../game/User';
import UserModel from '../model/UserModel';
import { JWTProps } from '../types';

export default async (ctx: Context, next: Next): Promise<void> => {
  const jwToken = ctx.header[token.self] as string;
  const verified = JsonWebToken.verify(jwToken, process.env.JWT_SECRET) as JWTProps;
  const user: User = UserModel.getUserInfoById(verified[token.userId]);

  ctx.state.user = {
    id: user.id,
    name: user.name,
    creator: user,
  };

  await next();
};
