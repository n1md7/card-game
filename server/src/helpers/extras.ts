export const isset = (value: any): boolean => value !== undefined && value !== null;

export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};
