import axios from "axios";
import { baseURL, token as tokenKey } from "../constants/urls";
import { tokenStore } from "./token";

const config = {
  baseURL,
  timeout: 2000,
  headers: {}
};

let ajax = axios.create( config );

// listener for the token update from App.jsx
tokenStore.onUpdate( ( token ) => {
  config.headers[ tokenKey ] = token;
  ajax = axios.create( config );
} );

export {
  ajax
};
