import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


const CreateGame = (props: any) => {

    const [options, setOptions] = useState({games: "1", players: "2"});

    const handleGamesSelect = (event: any) => {
        const val = event.target.value;
        setOptions({...options, games: val});
    }

    const handlePlayersSelect = (event: any) => {
        const val = event.target.value;
        setOptions({...options, players: val});
    }

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>Create Game</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <label>Games</label>
                <select className="form-control" name="games" onChange={handleGamesSelect}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>

                <label>Players</label>
                <select className="form-control" name="players" onChange={handlePlayersSelect}>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={() => props.createGameHandler(options)}>Create</Button>
            </Modal.Footer>
        </Modal.Dialog>
    )
}

export default CreateGame;