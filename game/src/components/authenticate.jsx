import React, {useState, Fragment} from "react";
import {useDispatch} from "react-redux";
import {updateUser} from "../actions";

export default () => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const nameChangeHandler = ({target: {value}}) => setName(value);

    const submitHandler = event => {
        event.preventDefault();
        dispatch(updateUser({name}));
    };

    return (
        <Fragment>
            <div className="row justify-content-center my-5 text-center">
                <div className="col-md-4">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <input
                                autoFocus={'on'}
                                autoComplete={'off'}
                                value={name}
                                onChange={nameChangeHandler}
                                placeholder="Nickname"
                                maxLength={16}
                                className="form-control"/>
                            <small className="form-text text-muted">
                                This name will be used during the game
                            </small>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-primary">
                            START
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};
