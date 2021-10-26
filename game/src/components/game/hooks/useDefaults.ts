import { useLayoutEffect, useState } from 'react';
import defaultsValue from '../../../constants/defaults';
import Ellipse, { Pythagoras } from '../../../libs/Formulas';

const useDefaults = () => {
  const [defaults, setDefaults] = useState(defaultsValue);
  const cardDiagonal = Pythagoras(defaults.cardHeight, defaults.cardWidth);
  const outerEllipse = new Ellipse(defaults.tableWidth - cardDiagonal / 2, defaults.tableHeight - cardDiagonal / 2);
  const xTableStyle = {
    width: defaults.tableWidth,
    height: defaults.tableHeight,
  };

  useLayoutEffect(() => {
    function updateSize() {
      setDefaults((prevState) => {
        prevState.windowWidth = window.innerWidth;
        prevState.cardDiagonal = cardDiagonal;
        prevState.xActionsHeight = window.innerHeight * 0.05;

        return prevState;
      });
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return [outerEllipse, defaults, xTableStyle];
};

export default useDefaults;
