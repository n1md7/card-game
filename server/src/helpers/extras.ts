export const isset = (value: any): boolean => value !== undefined && value !== null;

export const getRandomInt = (max = 10): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const isEven = (value: number): boolean => value % 2 === 0;

/** @Description Removes a reference to the object */
export const copy = <ObjectType>(obj: ObjectType): ObjectType => JSON.parse(JSON.stringify(obj));
