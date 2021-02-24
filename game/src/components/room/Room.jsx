import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../../redux/actions';
import {httpClient} from '../../services/httpClient';
import {urls} from '../../constants/urls';
import {Alert, AlertType} from '../../helpers/toaster';
import GameRoom from '../game/Room';

// id is prop passed from Lobby
// when redirect happens prop id is null
export default function Room({history, id}){
  // roomId is URL route param
  const $user = useSelector(({user}) => user);
  const [joining, setJoining] = useState(true);
  const {roomId} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // when accessed directly from the URL
    // we dont know that roomId definitely exists
    // or the user is able to join the table
    if ( !id) {
      httpClient.post(urls.joinRoom, {
          id: roomId, name: $user.name,
        })
        .then(({data}) => data)
        .then(({ok, room, msg}) => {
          if ( !ok || !room) {
            // hmm that's bad
            throw new Error(msg);
          }

          return room.id;
        })
        // trigger redux user store object update
        // which will be caught from the component Lobby
        .then(roomID => {
          dispatch(updateUser({roomId: roomID}));
          setJoining(false);
        })
        .catch(error => {
          // error on non valid roomId
          // so reset it
          dispatch(updateUser({roomId: null}))
          setJoining(false);
          Alert(AlertType.ERROR, error.message, 10);
        });
    }
  }, []);

  return $user.roomId ? (
    <GameRoom history={history}/>
  ) : joining ? 'loading...' : (
    <div className={'row justify-content-center'}>
      <div className="col col-md-6 mx-3">
        <div className={'alert alert-danger'}>
          Requested room ID does not exist or
          you are not allowed to join here!
        </div>
      </div>
    </div>
  )
}
