export const isset = (value: any): boolean => value !== undefined && value !== null;

export const getRandomInt = (max: number = 10): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const isEven = (value: number): boolean => value % 2 === 0;
