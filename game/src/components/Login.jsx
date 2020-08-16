import React, {useState} from 'react';
import Cookies from "js-cookie";

import Axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";


function Login(props) {

    const [username, setUsername] = useState("");
    const inputOnChange = (event) => {
        const val = event.target.value;
        setUsername(val);
    }

    const onSubmit = () => {
        Axios
            .get(props.urls.base + props.urls.auth + username)
            .then((res) => {
                Cookies.set("user", res.data.user);
                props.onAuthorise(true);
                console.log(res.data.user);
            })
            .catch((err) => {
                console.log(err);
                props.onAuthorise(false);
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
                        value={username}
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
