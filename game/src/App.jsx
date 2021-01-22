import React, {useEffect} from 'react';
import Authenticate from './components/Authenticate';
import Lobby from './components/Lobby';
import {useDispatch, useSelector} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {httpClient} from './services/httpClient';
import {urls, baseURL, token as tokenKey} from './constants/urls';
import {tokenStore} from './services/token';
import {ToastContainer} from 'react-toastify';
import {updateUser} from './redux/actions';
import {Alert, AlertType} from './helpers/toaster';

// when user.name is not defined
// it always shows auth component
export default function App(){
  const $user = useSelector(({user}) => user);
  const dispatch = useDispatch();

  useEffect(() => {
    // get permanent token from the local storage
    const tokenValue = localStorage.getItem(tokenKey);
    // update token store which will trigger
    // ajax config update and set the headers
    tokenStore.setToken(tokenValue);
    // check whether or not our token is valid
    httpClient.get(baseURL + urls.statusCheck)
      .then(({data}) => data)
      .then(({ok, msg}) => {
        if ( !ok) {
          // jwt not valid or not set
          // so need new init request
          throw new Error(msg);
        }
        const name = localStorage.getItem('name');
        dispatch(updateUser({name}));
        // its all good, prev token is valid
        // we can continue without init request
        // update token state to tell component to move forward
      }).catch(({message}) => {
      Alert(AlertType.ERROR, message, 10);
    });
  }, []);


  return (
    <Router>
      {
        $user.name ? <Lobby/> : <Authenticate/>
      }
      <ToastContainer/>
    </Router>
  );
}
