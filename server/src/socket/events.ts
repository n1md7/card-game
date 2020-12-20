type Seat = {
  seat: "up" | "down" | "left" | "right"
};

export const playerJoin = ( { seat }: Seat ) => {
  console.log( `user connected ${ seat }` )
};