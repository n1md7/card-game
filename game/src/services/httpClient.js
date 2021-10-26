import axios from 'axios';
import { baseURL, token as tokenKey } from '../constants/urls';
import { tokenStore } from './token';

const config = {
  baseURL,
  timeout: 5000,
  headers: {},
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || [401, 403].includes(status);
  },
};

export let httpClient = axios.create(config);

// listener for the token update from App.jsx
tokenStore.onUpdate((token) => {
  config.headers[tokenKey] = token;
  httpClient = axios.create(config);
});
