import React, {useEffect, useState} from "react";
import ajax from "axios";
import {urls} from "../constants/urls";

const RoomsList = () => {
    const [list, setList] = useState([]);
    useEffect(() => {
        (function loadRooms() {
            ajax.get(urls.show_rooms)
                .then(({data}) => data)
                .then(({ok, rooms}) => {
                    if (!ok) {
                        // todo log error
                        // hmm that's bad
                        return [];
                    }

                    return Object.entries(rooms);
                })
                .then(setList)
                .then(() => {
                    // call load function every 1 sec
                    setTimeout(loadRooms, 1000);
                })
                .catch(error => {
                    // todo log this
                    // hmm again too bad
                    setList([]);
                });
        })();
        
    }, []);

    return (
        <div className="row justify-content-center">
            <div className="col-12 text-center">
                <table className="table table-sm table-hover">
                    <thead>
                    <tr>
                        <td>ID</td>
                        <td>Creator</td>
                        <td>Players</td>
                        <td>Action</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        list.map(([key, values]) => <RoomRow key={key} {...values} />)
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
};


const RoomRow = ({id, creator, inRoomSize, size}) => (
    <tr>
        <td>{id}</td>
        <td>{creator.name}</td>
        <td>{inRoomSize}/{size}</td>
        <td>
            <button
                data-id={id}
                className="btn btn-sm btn-outline-secondary">
                Join
            </button>
        </td>
    </tr>
);

export default RoomsList;
