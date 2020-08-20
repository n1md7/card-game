import React, {Fragment, useState} from "react";
import ajax from "axios";
import {urls} from "../../constants/urls";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../redux/actions";

export default function Create() {
    const dispatch = useDispatch();
    const [size, setSize] = useState(2);
    const [isPublic, setIsPublic] = useState(true);
    // get name value from the redux store
    const name = useSelector(({user}) => user.name);
    // define event change handlers
    const sizeChangeHandler = ({target: {value}}) => setSize(+value);
    const isPublicChangeHandler = ({target: {value}}) => setIsPublic(!!value);
    const formSubmitHandler = function (event) {
        event.preventDefault();
        const {
            size,
            isPublic,
            name
        } = this;
        ajax.post(urls.create_room, {
            size,
            isPublic,
            name
        })
            .then(({data}) => data)
            .then(({ok, roomId, msg}) => {
                if (!ok || !roomId) {
                    // todo log error
                    // hmm that's bad
                    throw new Error(msg);
                }

                return roomId;
            })
            // trigger redux user store object update
            // which will be caught from the component Lobby
            .then(roomId => dispatch(updateUser({roomId})))
            .catch(error => {
                // todo log this
                // hmm again too bad
                console.debug(error);
            });
    }.bind({
        size,
        isPublic,
        name
    })

    return (
        <Fragment>
            <h3 className="text-center mt-5 mb-4 text-muted">Create Room</h3>
            <form onSubmit={formSubmitHandler}>
                <div className="form-row justify-content-center">
                    <div className="form-group col-md-3">
                        <label htmlFor="room-size">Room size</label>
                        <select id="room-size" onChange={sizeChangeHandler} className="form-control">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="room-visibility">Room visibility</label>
                        <select id="room-visibility" onChange={isPublicChangeHandler} className="form-control">
                            <option value="1">Public</option>
                            <option value="0">Private</option>
                        </select>
                    </div>
                    <div className="col-12">{''}</div>
                    <div className="form-group col-md-6 text-center">
                        <button type="submit" id="create" className="btn btn-secondary w-100">Create</button>
                    </div>
                </div>
            </form>
        </Fragment>
    );
};
