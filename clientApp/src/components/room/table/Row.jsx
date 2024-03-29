import React, { useState } from 'react';
import { httpClient } from '../../../services/httpClient';
import useUser from '../../../hooks/useUser';
import { useHistory } from 'react-router';
import handleError from '../../../helpers/handleError';

export default function Row(props) {
  const name = useUser();
  const history = useHistory();
  const [joinText, setJoinText] = useState('Join');
  // bind user id to access using this keyword
  // and dispatch to redux user store and update
  const joinClickHandler = (room) => () => {
    setJoinText('Joining...');
    httpClient
      .post(`v1/game/enter`, { id: room.id, name })
      .then((response) => {
        if (response.status === 200) {
          // Redirect to game room
          const id = String(response.data.id).replace(/G-/g, '');
          return history.push(`/G/${id}`);
        }
        throw new Error(response.data);
      })
      .catch((error) => {
        handleError(error);
        // just 1s delay
        setTimeout(() => {
          setJoinText('Join');
        }, 1000);
      });
  };

  return (
    <tr style={{ verticalAlign: 'middle' }} className={props.isStarted ? 'game-started' : ''}>
      <td>{props.id}</td>
      <td>{props.creator.name}</td>
      <td>{props.createdAt}</td>
      <td>
        {props.inRoomSize}/{props.size}
      </td>
      <td>{props.isStarted ? 'Started' : 'Waiting for players'}</td>
      <td>
        <button
          onClick={joinClickHandler(props)}
          className="btn btn-sm btn-outline-secondary"
          disabled={props.isStarted}
        >
          {joinText}
        </button>
      </td>
    </tr>
  );
}
