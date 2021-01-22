import {useEffect, useState} from 'react';
import defaultsValue from '../../../constants/defaults';
import Ellipse, {Pythagoras} from '../../../libs/Formulas';

const useDefaults = () => {
  const [defaults, setDefaults] = useState(defaultsValue);
  const cardDiagonal = Pythagoras(
    defaults.cardHeight,
    defaults.cardWidth,
  );
  const outerEllipse = new Ellipse(
    defaults.tableWidth - cardDiagonal / 2,
    defaults.tableHeight - cardDiagonal / 2,
  );
  const xTableStyle = {
    width: defaults.tableWidth,
    height: defaults.tableHeight,
  };

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const xActionsHeight = window.innerHeight * 0.05;

    setDefaults(prevState => {
      prevState.windowWidth = windowWidth;
      prevState.cardDiagonal = cardDiagonal;
      prevState.xActionsHeight = xActionsHeight;

      return prevState;
    });
  }, []);

  return [outerEllipse, defaults, xTableStyle];
};

export default useDefaults;
