import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './sheet.css';
import { evaluateur } from '../../../services/evaluateur';
import { AuthContext } from '../../../contexts/AuthContext';

import {
    saveSheet as _saveSheet,
    renameSheet as _renameSheet,
    updateSheetData as _updateSheetData,
} from '../../../services/api-service';
import { getSheetById, getSheetData } from '../../../services/api-service';

import { io } from 'socket.io-client';

// TODO : Save automatique
// TODO : Modification en même temps

export default function Sheet() {
    const { idSheet } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Feuille de calcul';
        const socket = io('http://localhost:4242');

        // socket.on('connect', () => {
        //     console.log('connected');
        //     socket.emit('join-room', idSheet);
        // });

        socket.on(`sheet-update/${idSheet}`, (data) => {
            console.log('sheet-update');
            console.log(data);
        });

        getSheet();
    }, []);

    const numberOfRows = 100;
    const numberOfColumns = 30;
    const [nameSheet, setNameSheet] = useState('Sans Nom');
    const [draggedCell, setDraggedCell] = useState(null);
    const [idt_sht, setIdt_sht] = useState(null);
    const [sheetExist, setSheetExist] = useState(false);
    const [colSelect, setSelectCol] = useState(null);
    const [rowSelect, setSelectRow] = useState(null);
    const [keyDownHandled, setKeyDownHandled] = useState(false);
    const [nameRows, setNameRows] = useState(
        Array.from({ length: numberOfRows }, (_, index) => index + 1),
    );
    const [nameColums, setNameColums] = useState(generateNameColumns());

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
    async function renameSheet() {
        console.log('save');
        console.log(idt_sht);
        const response = await _renameSheet(idt_sht, nameSheet);

        if (response.status === 200) {
            console.log('ok');
            const _body = await response.json();
            console.log(_body);
        }
    }

    async function updateSheetData(cell, val) {
        setSelectCol(null);
        setSelectRow(null);
        console.log('update data');
        console.log(idt_sht);
        console.log({ cell, val });
        const response = await _updateSheetData(idt_sht, cell, val, '');
    }

    async function getSheet() {
        console.log('get sheet');
        console.log(new Date().getTime());
        const sheetResponse = await getSheetById(idSheet);
        const sheetBody = await sheetResponse.json();
        const sheetData = sheetBody.data;
        if (sheetResponse.status === 200) {
            if (sheetData.sht_idtusr_aut !== user.usr_idtusr) {
                if (!sheetData.sht_shared) {
                    // TODO : a faire mieux ptet jsp ce qu'on pourrait faire
                    window.location.href = '/404';
                }
                // TODO add l'user à la liste des users qui ont accès à la sheet
            }

            setNameSheet(sheetData.sht_name);
            setIdt_sht(sheetData.sht_idtsht);
            const cellsResponse = await getSheetData(sheetData.sht_idtsht);
            const cellsBody = await cellsResponse.json();

            for (let key in cellsBody.data) {
            
                setContentCell(
                    cellsBody.data[key].cel_idtcel,
                    cellsBody.data[key].cel_val,
                );
            }
            setSheetExist(true);
        } else {
            //TODO: c'est censé renvoyer une erreur 404 dans le corps de la réponse
            window.location.href = '/404';
        }
    }

    /**
     *
     * @param {*} event
     * @param {*} cellKey
     */
    function handleKeyDown(event, cellKey) {
        if (keyDownHandled) setKeyDownHandled(false);
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.target.innerText.startsWith('=')) {
                const res = evaluateur(event.target.innerText.substring(1));
                event.target.innerText = res;
            }
            event.target.blur();
            updateSheetData(cellKey, event.target.innerText);
        }
        if (event.ctrlKey && event.key === 'c') {
            handleCopy();
            updateSheetData(cellKey, event.target.innerText);
        }
    }

    /**
     * Handle the change of the input the user is typing in
     * @param {*} event the event of the input
     * @param {string} cellKey id of the cell
     */
    function handleInputChange(event, cellKey) {
        if (event.target.innerText === '/n') event.target.innerText === '';
       
        
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
        setContentCell(keyCell, text);
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
        event.dataTransfer.setData('text/plain', event.target.innerText);
        setDraggedCell(keyCell);
    }

    /**
     *
     * @param {*} event
     * @param {*} keyCell
     */
    function handleDrop(event, keyCell) {
        console.log(event.dataTransfer.getData('text/plain'));
        setContentCell(keyCell, '');
       

        setContentCell(draggedCell, '');
        setDraggedCell(null);
        updateSheetData(draggedCell, '');
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

    function handleSelectAllInput(event) {
        event.target.select();
    }

    function setContentCell(cellKey, content) {
        console.log(cellKey, content);
        const td = document.getElementById(cellKey);
        if (td) {
            const divChild = td.querySelector('div');
            if (divChild) {
                divChild.innerText = content;
            }
        }
    }

    function handleKeyDownInput(event) {
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    if (!sheetExist) return <></>;
    return (
        <>
            <input
                className="sht-input-name"
                value={nameSheet}
                onChange={nameSheetChange}
                onClick={handleSelectAllInput}
                onBlur={renameSheet}
                onKeyDown={handleKeyDownInput}
            ></input>
            <div className="sht-container-all">
                <div className="sht-container-tab">
                    <table className="sht-table">
                        <thead>
                            <tr>
                                <th></th>
                                {nameColums.map((nameCol, i) => (
                                    <th
                                        key={nameCol}
                                        className={
                                            nameCol === colSelect
                                                ? 'sht-select-col-row'
                                                : ''
                                        }
                                    >
                                        {nameCol}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {nameRows.map((nameRow, i) => (
                                <tr key={nameRow}>
                                    <th
                                        key={nameRow}
                                        className={
                                            nameRow === rowSelect
                                                ? 'sht-select-col-row'
                                                : ''
                                        }
                                    >
                                        {nameRow}
                                    </th>
                                    {nameColums.map((nameCol) => (
                                        <td
                                            id={nameCol + '_' + nameRow}
                                            key={nameCol + '_' + nameRow}
                                            draggable
                                            onDragStart={(event) =>
                                                handleDragStart(
                                                    event,
                                                    nameCol + '_' + nameRow,
                                                )
                                            }
                                            onDrop={(event) =>
                                                handleDrop(
                                                    event,
                                                    nameCol + '_' + nameRow,
                                                )
                                            }
                                        >
                                            <div
                                                contentEditable
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
                                                    handleSelectAll(
                                                        event,
                                                        nameCol,
                                                        nameRow,
                                                    )
                                                }
                                                onDoubleClick={handleSelectAll}
                                                onBlur={(event) =>
                                                    updateSheetData(
                                                        nameCol + '_' + nameRow,
                                                        event.target.innerText,
                                                    )
                                                }
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
