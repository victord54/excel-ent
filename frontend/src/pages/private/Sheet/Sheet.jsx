import { useState, useEffect,useRef } from 'react';
import { useParams } from 'react-router-dom';
import './sheet.css';

export default function Sheet() {
    let { uuidSheet} = useParams();
    const numberOfRows = 100;
    const numberOfColumns = 30;

    const nameRows = Array.from( {length: numberOfColumns}, (_,index) => index + 1);
    const nameColums = generateNameColumns();

    const [cells, setCells] = useState([]);


    function generateNameColumns(){
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let res = [];
        for (let i = 0 ; i < numberOfColumns; i ++){
            let str = '';
            for (let j = i; j >=0 ; j = Math.floor(j/26) -1){
                str = alphabet[j%26] + str;
            }
            res.push(str);
        }

        return res;
    }


    function handleInputChange(event, cellKey){
        const updatedCells = {...cells};
        updatedCells[cellKey] = event.target.innerText;
        setCells(updatedCells);
        console.log(cells);
    }

    function saveSheet(){
        console.log('save');
        console.log(cells);
    }   

    function handleEnter(event){
        if (event.key === 'Enter'){
            event.preventDefault();
            event.target.blur();
        }
    }


    return (
        <>
        <button onClick={saveSheet}>Save</button>
            <div className="sht-container-all">
                <div className="sht-container-tab">
                    <table className='sht-table'>
                        <thead>
                            <tr>
                                <th></th>
                                {nameColums.map((nameCol, i) => (
                                    <th key={nameCol}>{nameCol}</th>
                                ))}   
                            </tr>

                        </thead>
                        <tbody>
                            {nameRows.map((nameRow, i) => (
                                 <tr key={nameRow}>
                                    <td key={nameRow}>{nameRow}</td>
                                    {nameColums.map(nameCol => (
                                        <td key={nameCol + '_' + nameRow} 
                                        contentEditable
                                        onInput={(event) => handleInputChange(event, nameCol + '_' + nameRow)}
                                        onKeyDown={(event) => handleEnter(event)}
                                        >
                                        </td>
                                    )
                                    )}
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}