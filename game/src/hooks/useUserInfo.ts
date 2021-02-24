import {useEffect, useState} from 'react';
import {baseURL} from '../constants/urls';
import {httpClient} from '../services/httpClient';
import handleError from '../helpers/handleError';

type UserInfo = {
  id: string,
  name: string,
  gameId?: string,
  socketId?: string
}|null;

const useUserInfo = (): [UserInfo, boolean] => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    httpClient.get(`${baseURL}v1/user`)
      .then(response => {
        if (response.status === 200) {
          return setUserInfo(response.data);
        }
        throw new Error(response.data);
      }).catch(handleError).then(() => {
      // Set loading to false when all is done
      setIsLoading(false);
    });
  }, []);

  return [userInfo, isLoading];
};

export default useUserInfo;