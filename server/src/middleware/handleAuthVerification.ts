import { Token, JWTProps } from '../types';
import { Context, Next } from 'koa';
import JsonWebToken from 'jsonwebtoken';
import User from '../game/User';
import UserModel from '../model/UserModel';

export default async (ctx: Context, next: Next): Promise<void> => {
  const jwToken = ctx.header[Token.self] as string;
  const verified = JsonWebToken.verify(jwToken, process.env.JWT_SECRET) as JWTProps;
  const user: User = UserModel.getUserInfoById(verified[Token.userId]);

  ctx.state.user = {
    id: user.id,
    name: user.name,
    creator: user,
  };

  await next();
};
