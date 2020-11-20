import { token } from "../config";
import { Context, Next } from "koa";
import setup from "../model/AuthModel";
import jwt from "jsonwebtoken";
import Player from "../game/Player";
import User from "../game/User";
import UserModel from "../model/UserModel";

interface TokenProps {
  "userId": string,
  "iat": number,
  "exp": number
}

export default async ( ctx: Context, next: Next ) => {
  const jwToken = ctx?.header ?. [ token.self ];
  let verified: TokenProps | any;

  try {
    verified = jwt.verify( jwToken, token.secret );
  } catch ( error ) {
    ctx.body = {
      ok: false,
      msg: error.message
    };

    return;
  }

  let user: User;
  try {
    user = UserModel.getUserInfo( ( verified as TokenProps )[ token.userId ] );
  } catch ( error ) {
    ctx.body = {
      ok: false,
      msg: error.message,
    };

    return;
  }
  ctx.state.user = {
    id: user.id,
    name: user.name,
    creator: user
  };

  await next();
};
