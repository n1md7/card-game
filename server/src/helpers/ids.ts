import {v4 as uuidv4} from "uuid";
import jsonwebtoken from "jsonwebtoken";

export const id = {
  user: (len = 5): string => `U-${uuidv4().substring(0, len)}`,
  room: (len = 5): string => `R-${uuidv4().substring(0, len)}`,
  game: (len = 5): string => `G-${uuidv4().substring(0, len)}`,
  player: (len = 5): string => `P-${uuidv4().substring(0, len)}`,
  token: (): string => `${uuidv4()}`,
  jwt: (data = {}): string => {
    return jsonwebtoken.sign(
      data,
      process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  },
};
