import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { httpClient } from '../../services/httpClient';

type Props = {
  children: React.ReactNode;
};

export default function ResultsView(props: Props) {
  const history = useHistory();

  const handleGoToLobby = () => {
    httpClient.put('/v1/game/exit').finally(() => {
      history.push('/join');
    });
  };

  return (
    <Modal show={true} animation={false} size="lg" centered backdrop={false} scrollable className={'text-center'}>
      <Modal.Header>
        <Modal.Title>Game is finished</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
        <p className={'mt-5'}>This game has been finished. You can start a new game.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGoToLobby}>
          Leave
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
