import React from 'react';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import './../css/grid.css';

const Grid = (props) => {
    return (
        <div className={'table-container'}>
            <Table striped hover bordered={false} size="sm">
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
        </div>
    )
}

export default Grid;