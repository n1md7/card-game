import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';

const Header = ({user, logOut}) => {

    return (
        <div className={'header'}>
            <div className={'logo'}>{''}</div>
            <div className={'user'}>
                <button onClick={logOut}
                        className='btn btn-outline-dark' >
                    <i>Logout </i>
                    <b>
                        {user}
                    </b>
                </button>
            </div>
        </div>
    )
}

export default Header;