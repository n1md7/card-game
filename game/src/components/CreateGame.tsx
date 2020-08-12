import React from 'react';
import Axios from 'axios'

const CreateGame = (props: any) => {
    const createGameClick = (event: any) => {
        Axios.get(props.createGameUrl)
            .then((response) => {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    };
    return (
        <div className={'create-game-container'}>
            <div className={'logo'}></div>

            <button className={'create-game-bt'} onClick={createGameClick}>
                Create Game
            </button>
        </div>
    )
}

export default CreateGame;