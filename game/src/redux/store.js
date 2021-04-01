import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

export default createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
    ),
  ),
);
