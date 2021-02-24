import React, {useState} from 'react';
import {httpClient} from '../../../services/httpClient';
import {baseURL} from '../../../constants/urls';
import useUser from '../../../hooks/useUser';
import {useHistory} from 'react-router';
import handleError from '../../../helpers/handleError';

export default function Row(props){
  const name = useUser();
  const history = useHistory();
  const [joinText, setJoinText] = useState('Join');
  // bind user id to access using this keyword
  // and dispatch to redux user store and update
  const joinClickHandler = room => () => {
    setJoinText('Joining...');
    httpClient
      .post(`${baseURL}v1/game/enter`, {id: room.id, name})
      .then(response => {
        if (response.status === 200) {
          // Redirect to game room
          return history.push(`/room/${response.data.id}`);
        }
        throw new Error(response.data);
      })
      .catch(error => {
        handleError(error);
        // just 1s delay
        setTimeout(() => {
          setJoinText('Join')
        }, 1000);
      });
  };

  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.creator.name}</td>
      <td>{props.inRoomSize}/{props.size}</td>
      <td>
        <button
          onClick={joinClickHandler(props)}
          className="btn btn-sm btn-outline-secondary">
          {joinText}
        </button>
      </td>
    </tr>
  );
};
