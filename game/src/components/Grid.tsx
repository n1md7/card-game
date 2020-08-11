import React, {useState} from 'react';
import GridCell from "./GridCell";
import './../css/grid.css';

interface FilterValueProps {
    id: string;
    players: string;
}

const Grid = (props: any) => {

    const clickHandler = (id: number) => console.log(id);

    const [filterValue, setFilterValue] = useState<any>({...props.filters});

    const [data, setData] = useState([...props.data]);

    const onFilter = (event: any, dataKey: string) => {
        event.preventDefault();
        setFilterValue({...filterValue, [dataKey]:event.target.value});
        let tempFilter = {...filterValue, [dataKey]:event.target.value};
        let tempData = props.data;
        for(let key in tempFilter) {
            if(tempFilter.hasOwnProperty(key)) {
                tempData = tempData.filter((el: any) => el[key].toString().includes(tempFilter[key]));
            }
        }
        setData(tempData);
    }

    return (
        <div className={'grid'}>
            {
                props.data.length > 0 && Object.keys(props.data[0]).map(
                    (dataKey: string) =>
                        <input
                            key={dataKey}
                            className={'grid-filter'}
                            value={filterValue[dataKey]}
                            onChange={(event) => onFilter(event, dataKey)}
                        />
                )
            }
            {
                data.length === 0 ?
                    (<div>No data found!!!</div>) :
                    data.map(
                        (cellData: any) =>
                            <GridCell
                                key={cellData.id}
                                data={cellData}
                                clickHandler={clickHandler}
                            />
                    )
            }
        </div>

    )
}

export default Grid;