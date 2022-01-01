import React from 'react';
import { useParams } from 'react-router-dom';
import PlayGround from '../game/PlayGround';
import useJoinRoom from '../../hooks/useJoinRoom';
import Header from '../Header';

export default function Room() {
  // roomId is URL route param
  const { roomId } = useParams();
  // When user will be redirected to Auth endpoint
  // This will be used to return back to the game room
  // when accessed directly from the URL
  // we dont know that roomId definitely exists
  // or the user is able to join the table
  const [gameId, isLoading, errorMessage] = useJoinRoom(`G-${roomId}`);

  if (isLoading) {
    return <div>Joining...</div>;
  }

  return gameId ? (
    <PlayGround />
  ) : (
    <Header>
      <div className={'row justify-content-center'}>
        <div className="col col-md-6 mx-3">
          <div className={'alert alert-danger'}>
            {errorMessage
              ? errorMessage
              : `
                Requested roomID[${roomId}] does not exist or
                you are not allowed to join here!
              `}
          </div>
        </div>
      </div>
    </Header>
  );
}
