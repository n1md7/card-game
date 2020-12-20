const isset = ( value: any ): boolean => value !== undefined && value !== null;

const getRandomInt = ( max: number ): number => {
  return Math.floor( Math.random() * Math.floor( max ) );
};

export {
  isset,
  getRandomInt
};
