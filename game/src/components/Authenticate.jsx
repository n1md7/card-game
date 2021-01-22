import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {updateUser} from '../redux/actions';
import {httpClient} from '../services/httpClient';
import {tokenStore} from '../services/token';
import {urls, baseURL, token as tokenKey} from '../constants/urls';
import {Alert, AlertType} from '../helpers/toaster';

export default () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const nameChangeHandler = ({target: {value}}) => setName(value);

  const submitHandler = event => {
    event.preventDefault();
    httpClient
      .get(baseURL + urls.init)
      .then(({data}) => data)
      .then(({ok, token, msg}) => {
        if ( !ok) {
          // hmm that's bad
          throw new Error(msg);
        }
        // custom store for the token
        tokenStore.setToken(token);
        // save it into permanent storage
        localStorage.setItem(tokenKey, token);
        // save name into storage
        localStorage.setItem('name', name);
        dispatch(updateUser({name}));
      })
      .catch(({message}) => {
        Alert(AlertType.ERROR, message, 10);
      });
  };

  useEffect(() => {
    // get name from the storage when available
    // and set it as a default value
    const storageName = localStorage.getItem('name');
    setName(storageName || '');
  }, []);

  return (
    <div className="container my-5">
      <div className="jumbotron">
        <h1 className="text-muted text-center">Card game</h1>
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
      </div>
    </div>
  );
};
