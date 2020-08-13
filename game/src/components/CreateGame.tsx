import React from 'react';
import Axios from 'axios'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";


const CreateGame = (props: any) => {

    const handleSelect = (event: any) => {
        let {name, value} = event.target;
        alert(name + " " + value);
    }

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Create Game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-default">Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Number of players
                    </Dropdown.Toggle>

                    <Dropdown.Menu onSelect={handleSelect}>
                        <Dropdown.Item>1</Dropdown.Item>
                        <Dropdown.Item>2</Dropdown.Item>
                        <Dropdown.Item>3</Dropdown.Item>
                        <Dropdown.Item>4</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={() => props.createGameHandler("giorgi", 1)}>Create</Button>
            </Modal.Footer>
        </Modal.Dialog>
    )
}

export default CreateGame;