export default class Ellipse {
  private readonly a: number = 0;
  private readonly b: number = 0;

  constructor(width: number, height: number) {
    this.a = width / 2;
    this.b = height / 2;
  }

  y(x: number): [number, number] {
    const value = (this.b * Math.sqrt(this.a ** 2 - x ** 2)) / this.a;
    return [-value, value];
  }
}

export const ellipseRanges = (width: number, skips = 4) => {
  const list = [];
  for (let i = -1 * width; i < width; i += skips) {
    list.push(i);
  }

  return list;
};

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const Pythagoras = (a: number, b: number) => {
  return Math.sqrt(a ** 2 + b ** 2);
}

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const isInRange = ([min, max]: [number, number], target: number): boolean => {
  return target >= min && target <= max;
}

