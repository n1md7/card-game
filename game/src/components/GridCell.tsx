import React from 'react';
import Button from "./Button";

const GridCell = ({data, clickHandler} : any)  => {
    return (

        <div className={'grid-cell'}>
            {Object.values(data).map((val: any, index: number) => <div key={index} className={'grid-cell-column'}>{val}</div>)}
            <Button clickHandler={() => clickHandler(data.id)}/>
        </div>
    );
}

export default GridCell;

