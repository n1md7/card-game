import React from 'react';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const Grid = (props) => {
    return (
        <Table striped hover size="sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Number of players</th>
                <th>Join</th>
            </tr>
            </thead>
            <tbody>
            {
                props.data.map((el) => (
                    <tr key={el.id}>
                        <td>{el.id}</td>
                        <td>{el.name}</td>
                        <td>{el.players}</td>
                        <td>
                            <Button onClick={() => props.joinGameHandler(el.id)}>Join</Button>
                        </td>
                    </tr>
                ))
            }

            </tbody>
        </Table>
    )
}

export default Grid;