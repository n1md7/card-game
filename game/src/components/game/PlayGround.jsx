import React, {useEffect} from 'react';

export default () => {

  useEffect(() => {
    document.getElementById('hey').innerHTML += ' hou'
  }, []);

  return (
    <div id={'hey'}>Play area</div>
  )
};