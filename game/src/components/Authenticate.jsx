import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {updateUser} from '../redux/actions';
import {httpClient} from '../services/httpClient';
import {tokenStore} from '../services/token';
import {baseURL, token as tokenKey} from '../constants/urls';
import Nav from './Nav';
import {random} from '../libs/Formulas';
import handleError from '../helpers/handleError';

export default () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const nameChangeHandler = ({target: {value}}) => setName(value);

  const submitHandler = event => {
    event.preventDefault();
    httpClient.get(`${baseURL}v1/auth/init`)
      .then(response => {
        if (response.status === 200) {
          // custom store for the token
          tokenStore.setToken(response.data.token);
          // save it into permanent storage
          localStorage.setItem(tokenKey, response.data.token);
          // save name into storage
          localStorage.setItem('name', name);
          dispatch(updateUser({name}));
          return null;
        }
        throw new Error(response.data);
      }).catch(handleError);
  };

  useEffect(() => {
    // get name from the storage when available
    // and set it as a default value
    const storageName = localStorage.getItem('name');
    setName(storageName || `Noob${random(10, 999)}`);
  }, []);

  return (
    <Nav>
      <div className="row justify-content-center my-5 text-center">
        <div className="col-sm-9 col-md-4 ">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <input
                autoFocus={true}
                autoComplete={'off'}
                value={name}
                spellCheck={false}
                onChange={nameChangeHandler}
                placeholder="Nickname"
                maxLength={16}
                className="form-control"/>
              <small className="form-text text-muted">
                This name will be used during the game
              </small>
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  type="submit"
                  className="w-100 btn btn-outline-primary">
                  START
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Nav>
  );
};
