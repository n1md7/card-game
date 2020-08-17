import {v4 as uuidv4} from "uuid";

export const id = {
    user: (len = 5): string => `U-${uuidv4().substring(0, len)}`,
    room: (len = 5): string => `R-${uuidv4().substring(0, len)}`,
    player: (len = 5): string => `P-${uuidv4().substring(0, len)}`,
};