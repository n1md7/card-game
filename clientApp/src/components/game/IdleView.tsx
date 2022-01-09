import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

type Props = {
  idleTime: number;
  children: React.ReactNode;
};

export default function IdleView(props: Props) {
  const [idle, setIdle] = useState(props.idleTime);
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setIdle(idle - 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [idle]);

  return (
    <Modal show={show} animation={false} size="lg" centered backdrop={false} scrollable className={'text-center'}>
      <Modal.Header>
        <Modal.Title>Round has been finished</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
        <p className={'mt-5'}>
          {idle > 0 && (
            <p>
              Next round starts <strong>{idle} seconds</strong>
            </p>
          )}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose} disabled={idle >= 0}>
          {idle <= 0 ? 'Continue' : `Continue [${idle}]`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
