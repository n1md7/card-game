import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateUser} from "../../redux/actions";

// id is prop passed from Lobby
// when redirect happens prop id is null
export default function Room({id}) {
    // roomId is URL route param
    const {roomId} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        // when accessed directly from the URL
        if (!id) {
            // get roomID from the store and dispatch it
            dispatch(updateUser({
                roomId
            }));
        }
    }, []);

    return roomId ? (
        <div>This is your game room {roomId}</div>
    ) : (
        <h3>Requested room ID: {roomId} does not exist!</h3>
    )

}
