import {useEffect, useState} from 'react';
import {baseURL} from '../constants/urls';
import {httpClient} from '../services/httpClient';
import handleError from '../helpers/handleError';
import useToken from './useToken';
import useUser from './useUser';

const useJoinRoom = (roomId: string): [string|undefined, boolean, string|undefined] => {
  useToken();
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<string|undefined>();
  const [error, setError] = useState<string|undefined>();
  const name = useUser();

  useEffect(() => {
    if (name) {
      const data = new FormData();
      data.append('id', roomId);
      data.append('name', name);
      httpClient({
        method: 'POST',
        url: `${baseURL}v1/game/enter`,
        data: {
          id: roomId,
          name,
        },
      }).then(response => {
        if (response.status === 200) {
          return setGameId(response.data?.id);
        }
        setError(response.data);
        throw new Error(response.data);
      }).catch(ex => {
        setError(handleError(ex));
      }).then(() => {
        // Set loading to false when all is done
        setIsLoading(false);
      });
    }
  }, [name]);

  return [gameId, isLoading, error];
};

export default useJoinRoom;