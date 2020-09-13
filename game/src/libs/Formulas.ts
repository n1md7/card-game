export default class Ellipse {
  private static a: number;
  private static b: number;

  static setDimensions( width: number, height: number ) {
    if ( width === 0 || height === 0 ) {
      throw new Error( 'width or height shouldn\'t be zero' );
    }
    Ellipse.a = width / 2;
    Ellipse.b = height / 2;
  }

  static y( x: number ): [ number, number ] {
    const value = ( Ellipse.b * Math.sqrt( Ellipse.a ** 2 - x ** 2 ) ) / Ellipse.a;
    return [ -value, value ];
  }
}

export const ellipseRanges = ( size: number, skips = 4 ) => {
  const list = [];
  for ( let i = -1 * size; i < size; i += skips ) {
    list.push( i );
  }

  return list;
};

export const random = ( min: number, max: number ) => {
  return Math.random() * ( max - min ) + min;
}

export const Pythagoras = ( a: number, b: number ) => {
  return Math.sqrt( a ** 2 + b ** 2 );
}

