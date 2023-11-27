import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './sheet.css';
import { evaluateur } from '../../../services/evaluateur';
import { getLoggedUser } from '../../../services/user-service';

import { saveSheet as _saveSheet } from '../../../services/api-service';
import {getSheetById} from '../../../services/api-service';

// TODO : Save automatique
// TODO : Modification en même temps

export default function Sheet() {
    let { idSheet } = useParams();

    useEffect(() => {
        getSheet();
        document.title = 'Feuille de calcul';
    }, []);

    const numberOfRows = 100;
    const numberOfColumns = 30;
    const [cells, setCells] = useState([]);
    const [nameSheet, setNameSheet] = useState('Sans Nom');
    const [draggedCell, setDraggedCell] = useState(null);
    const [editable, setEditable] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [idt_sht, setIdt_sht] = useState(null);
    const [sheetExist, setSheetExist] = useState(false);
    const [colSelect, setSelectCol] = useState(null);
    const [rowSelect, setSelectRow] = useState(null);

    const nameRows = Array.from(
        { length: numberOfRows },
        (_, index) => index + 1,
    );
    const nameColums = generateNameColumns();

    /**
     * 
     * @returns 
     */
    function generateNameColumns() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let res = [];
        for (let i = 0; i < numberOfColumns; i++) {
            let str = '';
            for (let j = i; j >= 0; j = Math.floor(j / 26) - 1) {
                str = alphabet[j % 26] + str;
            }
            res.push(str);
        }

        return res;
    }

    /**
     * 
     */
    async function saveSheet() {
        console.log('save');
        console.log(cells);
        console.log(idt_sht);
        const response = await _saveSheet({
            sht_uuid: idSheet,
            sht_name: nameSheet,
            sht_data: cells,
            sht_sharing: 0,
            sht_idtsht: idt_sht,
        });
        const _body = await response.json();
        console.log(_body);
        if (response.status === 200) {
            console.log('ok');
            setIdt_sht(_body);
        }
    }

    async function getSheet() {
        const response = await getSheetById(idSheet);
        const _body = await response.json();
        if (response.status === 200) {
            setNameSheet(_body.sht_name);
            setCells(_body.sht_data);
            setIdt_sht(_body.sht_idtsht);
            for (const key in _body.sht_data){
                const divChild = getDivChild(key);
                if (divChild) divChild.innerText = _body.sht_data[key];
            }
            setSheetExist(true);
        } else {
            window.location.href = '/404';
        }
    }

    /**
     * 
     * @param {*} event 
     * @param {*} cellKey 
     */
    function handleKeyDown(event, cellKey) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (cells[cellKey].startsWith('=')) {
                const res = evaluateur(cells[cellKey].substring(1));
                setCells({ ...cells, [cellKey]: res });
                event.target.innerText = res;
            }
            event.target.blur();
        }
        if (event.ctrlKey && event.key === 'c') {
            handleCopy();
        }
    }

    /**
     * Handle the change of the input the user is typing in
     * @param {*} event the event of the input
     * @param {string} cellKey id of the cell 
     */
    function handleInputChange(event, cellKey) {
        if (event.target.innerText === '/n') return;
        const updatedCells = { ...cells };
        updatedCells[cellKey] = event.target.innerText;
        setCells(updatedCells);
    }

    /**
     * Copy the selected text
     */
    function handleCopy() {
        console.log('copy');
        const selection = window.getSelection();
        const copiedText = selection.focusNode.nodeValue;
        navigator.clipboard.writeText(copiedText);
    }

    /**
     * Past the text in the clipboard
     * @param {*} event event of the paste
     * @param {*} keyCell id of the receiving cell
     */
    function handlePaste(event, keyCell) {
        console.log('paste');
        const text = event.clipboardData.getData('text/plain');
        setCells({ ...cells, [keyCell]: text });
    }

    /**
     * Change the sheet name
     * @param {*} event event of the change
     */
    function nameSheetChange(event) {
        setNameSheet(event.target.value);
        document.title = `Feuille - ${event.target.value}`;
        if (event.target.value === '') document.title = 'Sans Nom';
    }


    /**
     * 
     * @param {*} event 
     * @param {*} keyCell 
     */
    function handleDragStart(event, keyCell) {
        if (event.target.innerText === '') return;
        console.log('dragStart');
        event.dataTransfer.setData('text/plain', cells[keyCell]);
        setEditable(false);
        setIsDragging(true);
        setCells({ ...cells, [keyCell]: '' });
        setDraggedCell(keyCell);
    }

    /**
     * 
     * @param {*} event 
     * @param {*} keyCell 
     */
    function handleDrop(event, keyCell) {
        console.log('drop');
        setIsDragging(false);
        setEditable(true);
        setCells({
            ...cells,
            [keyCell]: event.dataTransfer.getData('text/plain'),
        });

        const divChild = getDivChild(draggedCell);
        if (divChild) divChild.innerText = '';
        setDraggedCell(null);
        
        const divChildTarget = getDivChild(keyCell);
        if (divChildTarget) {
            if (divChildTarget === ''){
                 divChildTarget.innerText =
                    event.dataTransfer.getData('text/plain');
                }
            }
    }

    /**
     * 
     * @param {*} event 
     */
    function handleSelectAll(event, nameCol, nameRow) {
        const range = document.createRange();
        range.selectNodeContents(event.target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        setSelectCol(nameCol);
        setSelectRow(nameRow);
    }

    function handleSelectAllInput(event){
        event.target.select();
    }

    /**
     * 
     * @param {*} cellKey 
     * @returns 
     */
    function getDivChild(cellKey) {
        const td = document.getElementById(cellKey);
        if (td) {
            const divChild = td.querySelector('div');
            if (divChild) {
                return divChild;
            }
        }
        return '';
    }
    function handleBlur(){
        setSelectCol(null);
        setSelectRow(null);
    }
   
    if (!sheetExist) return (<></>);
    return (
        <>
            <input
                className="sht-input-name"
                value={nameSheet}
                onChange={nameSheetChange}
                onClick={handleSelectAllInput}
            ></input>
            <button onClick={saveSheet}>Save</button>
            <div className="sht-container-all">
                <div className="sht-container-tab">
                    <table className="sht-table">
                        <thead>
                            <tr>
                                <th></th>
                                {nameColums.map((nameCol, i) => (
                                    <th key={nameCol} className={nameCol === colSelect ? 'sht-select-col-row' : ''} >{nameCol}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {nameRows.map((nameRow, i) => (
                                <tr key={nameRow}>
                                    <th key={nameRow} className={nameRow === rowSelect ? 'sht-select-col-row' : ''}>{nameRow}</th>
                                    {nameColums.map((nameCol) => (
                                        <td
                                            id={nameCol + '_' + nameRow}
                                            key={nameCol + '_' + nameRow}
                                            draggable
                                            onDrag={() => console.log('yes')}
                                            onDragStart={(event) =>
                                                handleDragStart(
                                                    event,
                                                    nameCol + '_' + nameRow,
                                                )
                                            }
                                            onDragOver={(event) =>
                                                event.preventDefault()
                                            }
                                            onDrop={(event) =>
                                                handleDrop(
                                                    event,
                                                    nameCol + '_' + nameRow,
                                                )
                                            }
                                        >
                                            <div
                                                contentEditable={
                                                    !isDragging && editable
                                                }
                                                onInput={(event) =>
                                                    handleInputChange(
                                                        event,
                                                        nameCol + '_' + nameRow,
                                                    )
                                                }
                                                onKeyDown={(event) =>
                                                    handleKeyDown(
                                                        event,
                                                        nameCol + '_' + nameRow,
                                                    )
                                                }
                                                onPaste={(event) =>
                                                    handlePaste(
                                                        event,
                                                        nameCol + '_' + nameRow,
                                                    )
                                                }
                                                onFocus={(event) =>
                                                    handleSelectAll(event, nameCol, nameRow)
                                                }
                    
                                                onDoubleClick={handleSelectAll}
                                                onBlur={handleBlur}
                                            ></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
