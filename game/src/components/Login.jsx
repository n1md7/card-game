import React, {useState} from 'react';
import Cookies from "js-cookie";

import Axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";



function Login({setAuth}) {

    const [name, setName] = useState("");
    const inputOnChange = ({target: {value}}) => {
        setName(value);
    }

    const onSubmit = () => {
        if(!name.length){
            alert('Enter fucking name');

            return false;
        }
        Cookies.set("name", name);
        setAuth(true);
    }

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Create Game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-default">Username</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        onChange={inputOnChange}
                        value={name}
                    />
                </InputGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={onSubmit}>Create</Button>
            </Modal.Footer>
        </Modal.Dialog>
    );
}

export default Login;
