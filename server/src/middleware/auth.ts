import { token } from "../config";
import { Context, Next } from "koa";
import setup from "../model/setup";
import jwt from "jsonwebtoken";
import Player from "../game/player";

interface TokenProps {
  "userId": string,
  "iat": number,
  "exp": number
}

export default async ( ctx: Context, next: Next ) => {
  // try to get token from the client response header
  const jwToken = ctx?.header ?. [ token.self ];
  let verified: TokenProps | any;

  try {
    // verify token and parse it
    verified = jwt.verify( jwToken, token.secret );
  } catch ( error ) {
    // not valid or expired
    ctx.body = {
      ok: false,
      msg: error.message
    };

    return;
  }

  // get user data
  let user: Player;
  try {
    user = setup.getUserInfo( ( verified as TokenProps )[ token.userId ] );
  } catch ( error ) {
    // this could happen when valid token exists but db is empty
    // when server is restarted and the db is not stateful
    // better to check
    ctx.body = {
      ok: false,
      msg: error.message,
    };

    return;
  }
  // update context with state key
  ctx.state.user = {
    id: user.getPlayerId(),
    name: user
  };

  await next();
};
