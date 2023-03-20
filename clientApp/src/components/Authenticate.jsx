import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/redux/actions';
import { httpClient } from '../services/httpClient';
import { tokenStore } from '../services/token';
import { Token } from 'shared-types';
import handleError from '../helpers/handleError';
import useAuth from '../hooks/useAuth';
import { getRandomInt } from '../libs/Formulas';
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import { marked } from 'marked';
import Rules from './Rules';

export default ({ history }) => {
  const [isAuth, isLoading] = useAuth();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const nameChangeHandler = ({ target: { value } }) => setName(value);
  const { roomId } = useParams();

  const submitHandler = (event) => {
    event.preventDefault();
    httpClient
      .get(`v1/auth/init`)
      .then((response) => {
        if (response.status === 200) {
          // custom store for the token
          tokenStore.setToken(response.data[Token.auth]);
          // save it into permanent storage
          localStorage.setItem(Token.auth, response.data[Token.auth]);
          // save name into storage
          localStorage.setItem(Token.name, name);
          dispatch(updateUser({ name }));
          return null;
        }
        throw new Error(response.data);
      })
      .catch(handleError);
  };

  useEffect(() => {
    // get name from the storage when available
    // and set it as a default value
    const storageName = localStorage.getItem(Token.name);
    setName(storageName || `Noob${getRandomInt(100, 999)}`);
  }, []);

  // When authenticated redirect to Lobby
  useLayoutEffect(() => {
    if (isAuth) {
      // When redirected from game room and auth
      // Redirect back to game room
      if (roomId && roomId !== 'null') {
        return history.push(`/G/${roomId}`);
      }
      history.push('/lobby');
    }
  }, [isAuth, roomId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Nav>
      <div className="row justify-content-center my-5 text-center">
        <div className="col-sm-9 col-md-4">
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
                className="form-control"
              />
              <small className="form-text text-muted">This name will be used during the game</small>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <button type="submit" className="w-100 btn btn-outline-primary">
                  START
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        className="row justify-content-center m-5 text-center"
        dangerouslySetInnerHTML={{
          __html: marked(Rules, {}),
        }}
      ></div>
    </Nav>
  );
};
