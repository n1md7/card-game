import React, { useState } from 'react';
import Nav from './Nav';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import Rules from './Rules';

const Header = ({ children }) => {
  const [hide, setHide] = useState(true);

  const handleHide = () => setHide(true);
  const handleShow = () => setHide(false);

  return (
    <Nav>
      <p className="text-muted text-center">
        You have two options: <br /> You can either create a new game room and share the link with your friend(s) to
        play,
        <br /> or you can join existing rooms.
      </p>
      <div className="row">
        <div className="col-12 text-center">
          <button onClick={handleShow} className="btn btn-sm btn-link">
            Game rules
          </button>
        </div>
      </div>
      <ul className="nav justify-content-center my-5 row">
        <li className="nav-item col-md-2 mb-md-0 mb-2">
          <Link className="nav-link btn btn-outline-dark btn-lg" to="/join">
            Join
          </Link>
        </li>
        <li className="nav-item col-md-2">
          <Link className="nav-link btn btn-outline-primary btn-lg" to="/create">
            Create
          </Link>
        </li>
      </ul>
      {children}
      <Modal size="lg" show={!hide} aria-labelledby="contained-modal-title-vcenter" centered onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Game rules</Modal.Title>
        </Modal.Header>
        <Modal.Body
          dangerouslySetInnerHTML={{
            __html: marked(Rules),
          }}
        ></Modal.Body>
        <Modal.Footer>
          <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Nav>
  );
};

export default Header;
