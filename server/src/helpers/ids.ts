import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { token } from "../config";

export const id = {
  user: ( len = 5 ): string => `U-${ uuidv4().substring( 0, len ) }`,
  room: ( len = 5 ): string => `R-${ uuidv4().substring( 0, len ) }`,
  player: ( len = 5 ): string => `P-${ uuidv4().substring( 0, len ) }`,
  jwt: ( data = {} ): string => {
    // todo token.secret should be in env file
    // todo which will be different for the prod
    return jwt.sign(
      data,
      token.secret, {
        expiresIn: '1h'
      } );
  }
};
