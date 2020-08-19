import React, {Fragment} from 'react';
import JoinRoom from "./joinRoom";
import CreateRoom from "./createRoom";
import {useSelector} from "react-redux";

const Lobby = () => {
    const {roomId} = useSelector(({user}) => user);

    return (
        roomId ?
            (
                <div>
                    You are in the room #{roomId}
                </div>
            ) :
            <Fragment>
                <CreateRoom/>
                <JoinRoom/>
            </Fragment>
    );
}

export default Lobby;
