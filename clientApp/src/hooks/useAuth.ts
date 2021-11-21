import { useEffect, useState } from 'react';
import { baseURL } from '../constants/urls';
import { tokenStore } from '../services/token';
import { httpClient } from '../services/httpClient';
import { updateUser } from '../store/redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import handleError from '../helpers/handleError';
import { Token } from 'shared-types';

const useAuth = (showError = true): [boolean, boolean] => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user: any = useSelector<any>((store) => store.user);

  useEffect(() => {
    if (user.name) {
      // get permanent token from the local storage
      const tokenValue = localStorage.getItem(Token.auth);
      // update token store which will trigger
      // httpClient config update and set the header
      tokenStore.setToken(tokenValue);
      // Redux dispatched auth so we get user data
      // It means user is authenticated
      setIsLoading(false);
      setIsAuth(true);
    }
  }, [user]);

  useEffect(() => {
    // get permanent token from the local storage
    const tokenValue = localStorage.getItem(Token.auth);
    // update token store which will trigger
    // httpClient config update and set the header
    tokenStore.setToken(tokenValue);
    // check whether or not our token is valid
    httpClient
      .get(`${baseURL}v1/auth/status`)
      .then((response) => {
        if (response.status === 401) {
          return null;
        }
        return response.data;
      })
      .then((data) => {
        if (data) {
          const name = localStorage.getItem(Token.name);
          dispatch(updateUser({ name }));
          // its all good, prev token is valid
          // we can continue without init request
          // update token state to tell component to move forward
        }
      })
      .catch((error) => {
        if (showError) {
          handleError(error);
        }
      })
      .then(() => {
        // Set loading to false when all is done
        setIsLoading(false);
      });
  }, []);

  return [isAuth, isLoading];
};

export default useAuth;
