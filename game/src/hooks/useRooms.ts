import {useEffect, useState} from 'react';
import {baseURL} from '../constants/urls';
import {httpClient} from '../services/httpClient';
import handleError from '../helpers/handleError';

type Room = {
  creator: {
    name: string
  },
  id: string,
  inRoomSize: number,
  isPublic: boolean,
  size: number
};

const useRooms = (): Room[] => {
  const [list, setList] = useState<Room[]>([]);

  useEffect(() => {
    const updateRoomsList = () => {
      httpClient
        .get(`${baseURL}v1/games`)
        .then(({data, status}) => {
          if (status === 200) {
            setList(data as Room[]);
            return null;
          }
          throw new Error(data as string);
        }).catch(handleError);
    };

    // trigger first load
    updateRoomsList();
    // set up ticker for every 1s update
    const interval = setInterval(updateRoomsList, 1000);
    // clean up function
    return () => clearInterval(interval);
  }, []);

  return list;
};

export default useRooms;