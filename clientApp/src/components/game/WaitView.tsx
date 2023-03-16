import React from 'react';
import { Modal } from 'react-bootstrap';

type Props = {
  children: React.ReactNode;
  max?: number;
  current?: number;
  setWait: (state: boolean) => void;
  wait: boolean;
};

export default function WaitView(props: Props) {
  return (
    <Modal
      show={props.wait}
      animation={false}
      size="lg"
      onHide={() => props.setWait(false)}
      centered
      backdrop={true}
      scrollable
      className={'text-center'}
    >
      <Modal.Header closeButton>
        <Modal.Title>Wait for players {props.max && props.current ? `${props.current}/${props.max}` : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
        {/*<p className={'mt-5'}>Or play with computer BOTs instead</p>*/}
      </Modal.Body>
    </Modal>
  );
}
