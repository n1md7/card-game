import React from 'react';
import { Button, Modal } from 'react-bootstrap';

type Props = {
  idleTime: number;
  children: React.ReactNode;
};

export default function IdleView(props: Props) {
  return (
    <Modal show={true} animation={false} size="lg" centered backdrop={false} scrollable className={'text-center'}>
      <Modal.Header>
        <Modal.Title>Round has been finished</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
        <p className={'mt-5'}>
          {props.idleTime > 0 && (
            <p>
              Next round starts <strong>{props.idleTime} seconds</strong>
            </p>
          )}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={props.idleTime >= 0}>
          {props.idleTime <= 0 ? 'Continue' : `Continue [${props.idleTime}]`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
