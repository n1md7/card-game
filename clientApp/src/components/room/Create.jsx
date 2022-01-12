import React, { useEffect, useState } from 'react';
import { httpClient } from '../../services/httpClient';
import { useSelector } from 'react-redux';
import Header from '../Header';
import handleError from '../../helpers/handleError';
import { useHistory } from 'react-router';

export default function Create() {
  const [gameId, setGameId] = useState(null);
  const [size, setSize] = useState(2);
  const [points, setPoints] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  // Get name value from the redux store
  const { name } = useSelector(({ user }) => user);
  // define event change handlers
  const sizeChangeHandler = ({ target: { value } }) => setSize(+value);
  const pointChangeHandler = ({ target: { value } }) => setPoints(+value);
  const isPublicChangeHandler = ({ target: { value } }) => setIsPublic(!!+value);
  const history = useHistory();

  const formSubmitHandler = function (event) {
    event.preventDefault();
    httpClient
      .post(`v1/game/create`, {
        size: this.size,
        isPublic: this.isPublic,
        name: this.name,
        points: this.points,
      })
      .then((response) => {
        if (response.status === 200) {
          return setGameId(response.data);
        }
        throw new Error(response.data);
      })
      .catch(handleError);
  }.bind({ size, isPublic, name, points });

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
        <div className="row justify-content-center">
          <div className="col-md-4">
            <label htmlFor="room-size">Room size</label>
            <select id="room-size" onChange={sizeChangeHandler} className="form-control">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <small className="form-text text-muted">Number of players in the room</small>
          </div>
          <div className="col-12 my-3">{/**/}</div>
          <div className="col-md-4">
            <label htmlFor="room-visibility">Max points</label>
            <select id="room-visibility" onChange={pointChangeHandler} className="form-control">
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="11">11</option>
            </select>
            <small className="form-text text-muted">Max point to reveal winner</small>
          </div>
          <div className="col-12 my-3">{/**/}</div>
          <div className="col-md-4">
            <label htmlFor="room-visibility">Room visibility</label>
            <select id="room-visibility" onChange={isPublicChangeHandler} className="form-control">
              <option value="1">Public</option>
              <option value="0">Private</option>
            </select>
            <small className="form-text text-muted">Only public rooms will appear in the list view</small>
          </div>
          <div className="col-12 m-3">{/**/}</div>
          <div className="form-group col-md-4 text-center">
            <button type="submit" id="create" className="btn btn-secondary w-100">
              Create
            </button>
          </div>
        </div>
      </form>
    </Header>
  );
}
