import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './sheet.css';
import { evaluateur } from '../../../services/evaluateur';
import { AuthContext } from '../../../contexts/AuthContext';

import {
    saveSheet as _saveSheet,
    renameSheet as _renameSheet,
    updateSheetData as _updateSheetData,
    checkAccess as _checkAccess,
} from '../../../services/api-service';
import { getSheetById, getSheetData } from '../../../services/api-service';

import { io } from 'socket.io-client';

export default function Sheet() {
    const { idSheet } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Feuille de calcul';
        checkAccess();
        const socket = io(import.meta.env.VITE_API_URL);
        const idsht = getSheet().then((idsht) => {
            socket.on('udpdateData', (data) => {
                console.log('socket udpdateData');
                console.log('user: ', user.usr_idtusr);
                console.log('u: ', data.idtusr_ori);
                console.log('s: ', data.cel_idtsht);
                console.log('sheet: ', idsht);
                if (
                    data.idtusr_ori === user.usr_idtusr ||
                    idsht != data.cel_idtsht
                )
                    return;
                console.log('data: ', data);
                console.log('idt_sht: ', idt_sht);
                console.log('client user: ', user.usr_idtusr);
                console.log('sheet id:', idt_sht);
                console.log('updateData');
                console.log('data: ', data);
                setContentCell(data.cel_idtcel, data.cel_val);
            });
        });
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
     * Method that generate the name of the columns.
     *
     * @returns {Array} Array of the name of the columns.
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
     * Method that check if the user has access to the sheet.
     * Send a request to the server.
     * Redirect to the 404 page if the user doesn't have access.
     */
    async function checkAccess() {
        const response = await _checkAccess(idSheet);
        // console.log(response);
        if (response.status === 200) {
        } else {
            window.location.href = '/404';
        }
    }

    /**
     * Method that handle when the user rename the sheet.
     */
    async function renameSheet() {
        const regex = /^[a-z\sA-Z0-9*'()_\-/À-ÖØ-öø-ÿ]+$/;
        if (!regex.test(nameSheet)) {
            //TODO : afficher un message d'erreur
            console.log('erreur');
            return;
        }

        const response = await _renameSheet(idt_sht, nameSheet);

        if (response.status === 200) {
            console.log('ok');
            const _body = await response.json();
            console.log(_body);
        }
    }

    /**
     * Method that handle when the user press enter in the input of the name.
     *
     * @param {Event} event The event.
     */
    function handleKeyDownInput(event) {
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    /**
     * Method that save the data of a cell.
     * Send a request to the server.
     *
     * @param {String} cell The id of the cell.
     * @param {String} val The value of the cell.
     */
    async function updateSheetData(cell, val) {
        console.log('updateSheetData');
        setSelectCol(null);
        setSelectRow(null);
        const response = await _updateSheetData(idt_sht, cell, val, '');
    }

    /**
     * Method that get the sheet.
     * Send a request to the server.
     *
     * @returns {BigInt} The id of the sheet.
     */
    async function getSheet() {
        const sheetResponse = await getSheetById(idSheet);
        const sheetBody = await sheetResponse.json();
        const sheetData = sheetBody.data;
        if (sheetResponse.status === 200) {
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
            console.log(sheetData.sht_idtsht);
            return sheetData.sht_idtsht;
        } else {
            //TODO: c'est censé renvoyer une erreur 404 dans le corps de la réponse
            window.location.href = '/404';
            //console.log(sheetResponse);
        }
    }

    /**
     * Method that handle when the user press a key in a cell.
     *
     * @param {Event} event The event.
     * @param {String} cellKey The id of the cell.
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
            //updateSheetData(cellKey, event.target.innerText);
        }
        if (event.ctrlKey && event.key === 'c') {
            handleCopy();
            updateSheetData(cellKey, event.target.innerText);
        }
    }

    /**
     * Method that copy the selected text.
     */
    function handleCopy() {
        const selection = window.getSelection();
        const copiedText = selection.focusNode.nodeValue;
        navigator.clipboard.writeText(copiedText);
    }

    /**
     * Method that past the text in the clipboard.
     *
     * @param {Event} event The vent of the paste.
     * @param {String} keyCell The id of the receiving cell.
     */
    function handlePaste(event, keyCell) {
        const text = event.clipboardData.getData('text/plain');
        setContentCell(keyCell, text);
    }

    /**
     * Method that change the sheet name.
     *
     * @param {Event} event The event.
     */
    function nameSheetChange(event) {
        setNameSheet(event.target.value);
        document.title = `Feuille - ${event.target.value}`;
        if (event.target.value === '') document.title = 'Sans Nom';
    }

    /**
     * Method that handle when the user start to drag a cell.
     *
     * @param {Event} event The event.
     * @param {String} keyCell The id of the cell.
     */
    function handleDragStart(event, keyCell) {
        if (event.target.innerText === '') return;
        event.dataTransfer.setData('text/plain', event.target.innerText);
        setDraggedCell(keyCell);
    }

    /**
     * Meethod that handle when the user drop a cell.
     *
     * @param {Event} event The event.
     * @param {String} keyCell The id of the cell.
     */
    function handleDrop(event, keyCell) {
        console.log(event.dataTransfer.getData('text/plain'));
        setContentCell(keyCell, '');

        setContentCell(draggedCell, '');
        setDraggedCell(null);
        updateSheetData(draggedCell, '');
    }

    /**
     * Method that handle when the user click on a cell.
     *
     * @param {Event} event The event.
     * @param {String} nameCol The name of the column.
     * @param {String} nameRow The name of the row.
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

    /**
     * Method that handle when the user click on the input of the name.
     *
     * @param {Event} event The event.
     */
    function handleSelectAllInput(event) {
        event.target.select();
    }

    /**
     * Method that set a content to a cell.
     *
     * @param {String} cellKey The id of the cell.
     * @param {String} content The content to set.
     */
    function setContentCell(cellKey, content) {
        console.log('setContentCell');
        const td = document.getElementById(cellKey);
        if (td) {
            const divChild = td.querySelector('div');
            if (divChild) {
                divChild.innerText = content;
            }
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
