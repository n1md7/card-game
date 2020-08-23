import React, {useState} from 'react';
import Cookies from "js-cookie";

import Axios from 'axios'

import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

import {urls} from "../constants/urls.js"


function Login({setAuth}) {

    const [name, setName] = useState("");
    const inputOnChange = ({target: {value}}) => {
        setName(value);
    }

    const onSubmit = () => {
        console.log(urls.auth);

        Axios
            .post(urls.auth, {"name" : name})
            .then((res) => {
                Cookies.set("user", res.data.user);
                setAuth(true);
            })
            .catch((err) => {
                setAuth(false);
            });
    }

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Log in</Modal.Title>
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
