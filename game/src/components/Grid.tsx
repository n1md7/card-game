import React, {useState} from 'react';
import GridCell from "./GridCell";
import './../css/grid.css';

const Grid = (props: any) => {
    const clickHandler = (id: number) => console.log(id);
    const [filterValue, setFilterValue] = useState('');
    const [data, setData] = useState([...props.data]);

    const onFilter = (event: any) => {
        setFilterValue(event.target.value);
        setData(props.data.filter((el: any) => el.id.toString().startsWith(event.target.value)));
    }

    return (
        <>
            <input
                className={'grid-filter'}
                value={filterValue}
                onChange={onFilter}
            />
            <div className={'grid'}>
                {
                    data
                        .map(
                            (cellData: any) =>
                                <GridCell
                                    key={cellData.id}
                                    data={cellData}
                                    clickHandler={clickHandler}
                                />
                        )
                }
            </div>
        </>
    )
}

export default Grid;