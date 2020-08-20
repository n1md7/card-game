import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/actions";

export default () => {
  const [ name, setName ] = useState( "" );
  const dispatch = useDispatch();
  const nameChangeHandler = ( { target: { value } } ) => setName( value );

  const submitHandler = event => {
    event.preventDefault();
    dispatch( updateUser( { name } ) );
  };

  return (
    <Fragment>
      <div className="row justify-content-center my-5 text-center">
        <div className="col-sm-9 col-md-4 ">
          <form onSubmit={ submitHandler }>
            <div className="form-group">
              <input
                autoFocus={ "on" }
                autoComplete={ "off" }
                value={ name }
                onChange={ nameChangeHandler }
                placeholder="Nickname"
                maxLength={ 16 }
                className="form-control"/>
              <small className="form-text text-muted">
                This name will be used during the game
              </small>
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  type="submit"
                  className="w-100 btn btn-outline-primary">
                  START
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};