import React, { useEffect, useState } from 'react';
import { httpClient } from '../../services/httpClient';
import { baseURL } from '../../constants/urls';
import { useSelector } from 'react-redux';
import Header from '../Header';
import handleError from '../../helpers/handleError';
import { useHistory } from 'react-router';

export default function Create() {
  const [gameId, setGameId] = useState(null);
  const [size, setSize] = useState(2);
  const [isPublic, setIsPublic] = useState(true);
  // Get name value from the redux store
  const { name } = useSelector(({ user }) => user);
  // define event change handlers
  const sizeChangeHandler = ({ target: { value } }) => setSize(+value);
  const isPublicChangeHandler = ({ target: { value } }) => setIsPublic(!!+value);
  const history = useHistory();

  const formSubmitHandler = function (event) {
    event.preventDefault();
    httpClient
      .post(`v1/game/create`, {
        size: this.size,
        isPublic: this.isPublic,
        name: this.name,
      })
      .then((response) => {
        if (response.status === 200) {
          return setGameId(response.data);
        }
        throw new Error(response.data);
      })
      .catch(handleError);
  }.bind({ size, isPublic, name });

  // Redirect to Game when ID is available
  useEffect(() => {
    if (gameId) {
      history.push(`/room/${gameId}`);
    }
  }, [gameId]);

  return (
    <Header>
      <h3 className="text-center mt-5 mb-4 text-muted">Create Room</h3>
      <form onSubmit={formSubmitHandler}>
        <div className="form-row justify-content-center">
          <div className="form-group col-md-3">
            <label htmlFor="room-size">Room size</label>
            <select id="room-size" onChange={sizeChangeHandler} className="form-control">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="room-visibility">Room visibility</label>
            <select id="room-visibility" onChange={isPublicChangeHandler} className="form-control">
              <option value="1">Public</option>
              <option value="0">Private</option>
            </select>
          </div>
          <div className="col-12">{''}</div>
          <div className="form-group col-md-6 text-center">
            <button type="submit" id="create" className="btn btn-secondary w-100">
              Create
            </button>
          </div>
        </div>
      </form>
    </Header>
  );
}
