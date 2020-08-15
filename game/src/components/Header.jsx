import React from 'react';
import Cookies from 'js-cookie';

const Header = (props) => {

    const getUser = () => {
        return Cookies.get('name');
    }

    const authorised = () => {
        return getUser() !== undefined;
    }

    const onLogout = () => {
        Cookies.remove('name');
        props.onAuthorise(false);
    }

    return (
        <div className={'header'}>
            <div className={'logo'}></div>
            <div className={'user'} style={{display: authorised() ? "block" : "none" }}>
                {getUser()}
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Header;