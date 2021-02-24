import {useEffect, useState} from 'react';
import {baseURL, token as tokenKey, urls} from '../constants/urls';
import {tokenStore} from '../services/token';
import {httpClient} from '../services/httpClient';
import {updateUser} from '../redux/actions';
import {Alert, AlertType} from '../helpers/toaster';
import {useDispatch, useSelector} from 'react-redux';

const useAuth = (): [boolean, boolean] => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user: any = useSelector<any>(({user}) => user);

  useEffect(() => {
    if (user.name) {
      // Redux dispatched auth so we get user data
      // It means user is authenticated
      setIsLoading(false);
      setIsAuth(true);
    }
  }, [user]);

  useEffect(() => {
    // get permanent token from the local storage
    const tokenValue = localStorage.getItem(tokenKey);
    // update token store which will trigger
    // httpClient config update and set the header
    tokenStore.setToken(tokenValue);
    // check whether or not our token is valid
    httpClient.get(`${baseURL}v1/auth/status`)
      .then(response => {
        if (response.status === 401) {
          setIsAuth(false);
          return null;
        }
        return response.data;
      }).then((data) => {
      if (data) {
        const name = localStorage.getItem('name');
        dispatch(updateUser({name}));
        setIsAuth(true);
        // its all good, prev token is valid
        // we can continue without init request
        // update token state to tell component to move forward
      }
    }).catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx and [401, 403]
        Alert(AlertType.ERROR, error.response.data, 10);
      } else if (error.request) {
        // The request was made but no response was received
        Alert(AlertType.ERROR, error.request, 10);
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert(AlertType.ERROR, error.message, 10);
      }
    }).then(() => {
      // Set loading to false when all is done
      setIsLoading(false);
    });
  }, []);

  return [isAuth, isLoading];
};

export default useAuth;