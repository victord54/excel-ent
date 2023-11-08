import { useState, useEffect,useRef } from 'react';
import { useParams } from 'react-router-dom';
import './sheet.css';

export default function Sheet() {
    let { uuidSheet} = useParams();
    const numberOfRows = 100;
    const numberOfColumns = 30;
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const inputRef = useRef(null);

    const nameRows = Array.from( {length: numberOfColumns}, (_,index) => index + 1);
    const nameColums = generateNameColumns();

    const [cells, setCells] = useState([]);

    let timer = 0;
    let delay = 200;
    let prevent = false;

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

    /** Fonction qui permet de gérer le click */
    function handleClick(event, cellKey){
        event.preventDefault();
        timer = setTimeout(function() {
            if (!prevent) {
                editingCell(cellKey);
            }
            prevent = false;
        }, delay);
    }

    /** Fonction qui permet de gérer le double click */
    function handleDoubleClick(event, cellKey){
        event.preventDefault();
        clearTimeout(timer);
        prevent = true;
        editingCell(cellKey);
    }

    function editingCell(cellKey){
        setSelectedCell(cellKey);
    }

    function handleInputChange(event, cellKey){
        const updatedCells = {...cells};
        updatedCells[cellKey] = event.target.value;
        setCells(updatedCells);
    }

    function handleCellKeyDown(event){
        if (event.key === 'Enter'){
            setSelectedCell(null);
        }
    }

    useEffect(() => {
        if (inputRef.current){
            inputRef.current.focus();
        } else {
            inputRef.current.blur();
        }
    }, [selectedCell]);

    return (
        <>
            <div className="sht-container-all">
                <div><input 
                    type='Text'
                    value={cells[selectedCell] || ''}
                    onChange={(event) => handleInputChange(event, selectedCell)}
                    onKeyDown={(event) => handleCellKeyDown(event)}
                    {...(selectedCell ? {disabled : false} : {disabled : true})}
                    ref={inputRef}
                    ></input>
                </div>
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
                                        onClick={(event) => handleClick(event, nameCol + '_' + nameRow)} 
                                        onDoubleClick={(event) => handleDoubleClick(event,nameCol + '_' + nameRow)}
                                        className={selectedCell === nameCol + '_' + nameRow ? 'selected-cell' : ''}
                                        >
                                            {cells[nameCol+'_'+nameRow]}
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