import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import './sheet.css';
import { evaluateur } from '../../../services/evaluateur';
import { AuthContext } from '../../../contexts/AuthContext';
import { TailSpin } from 'react-loader-spinner';
import Toast from '../../../components/Toast/Toast';

import {
    saveSheet as _saveSheet,
    renameSheet as _renameSheet,
    updateSheetData as _updateSheetData,
    checkAccess as _checkAccess,
    checkLock as _checkLock,
    updateLock as _updateLock,
} from '../../../services/api-service';
import { getSheetById, getSheetData } from '../../../services/api-service';

import { io } from 'socket.io-client';

export default function Sheet() {
    const [isLoading, setIsLoading] = useState(true);
    const { idSheet } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Feuille de calcul';
        checkAccessSheet();
        const fetchData = async () => {
            const socket = io(import.meta.env.VITE_API_URL);
            const idsht = getSheet().then((idsht) => {
                socket.on('udpdateData', (data) => {
                    if (
                        data.idtusr_ori === user.usr_idtusr ||
                        idsht != data.cel_idtsht
                    )
                        return;

                    setContentCell(data.cel_idtcel, data.cel_val);
                });
            });
            checkLockedCells();

            socket.on('updateLock', (data) => {
                if (
                    data.idtusr_ori === user.usr_idtusr ||
                    idt_sht != data.cel_idtsht
                )
                    return;
                setDivLock(data.cel_idtcel, data.cel_lock);
            });
        };
        fetchData();
    }, [idSheet]);

    const regexName = /^[a-z\sA-Z0-9*'()_\-/À-ÖØ-öø-ÿ]+$/;
    const numberOfRows = 100;
    const numberOfColumns = 30;
    const [nameSheet, setNameSheet] = useState('Sans Nom');
    const [errorNameSheet, setErrorNameSheet] = useState(false);
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
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [messageToast, setMessageToast] = useState('');

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
    async function checkAccessSheet() {
        const response = await _checkAccess(idSheet);
    }

    /**
     * Method that set the cell as locked or not.
     *
     * @param {String} cellKey The id of the cell.
     * @param {Boolean} lock The lock state.
     */
    async function setDivLock(cellKey, lock) {
        const td = document.getElementById(cellKey);
        if (td) {
            const divChild = td.querySelector('div');
            if (divChild) {
                if (lock) {
                    divChild.classList.add('sht-cell-locked');
                    divChild.contentEditable = false;
                    divChild.title =
                        "Cellule entrain d'être modifiée par un autre utilisateur";
                } else {
                    divChild.classList.remove('sht-cell-locked');
                    divChild.contentEditable = true;
                    divChild.title = '';
                }
            }
        }
    }

    /**
     * Method that get all the lockedl cells.
     * Send a request to the server.
     */
    async function checkLockedCells() {
        const response = await _checkLock(idt_sht);
        if (response.status === 200) {
            const body = await response.json();
            const data = body.data;
            for (let key in data) {
                setDivLock(data[key].cel_idtcel, true);
            }
        }
    }

    /**
     * Method that update the lock state of a cell.
     * Send a request to the server.
     *
     * @param {String} cell The id of the cell.
     * @param {Boolean} lock The lock state.
     */
    async function updateLockedCell(cell, lock) {
        const response = await _updateLock(idt_sht, cell, lock);
    }

    /**
     * Method that handle when the user rename the sheet.
     */
    async function renameSheet() {
        if (!regexName.test(nameSheet)) {
            setErrorNameSheet(true);
            return;
        }
        setErrorNameSheet(false);
        const response = await _renameSheet(idt_sht, nameSheet);

        if (response.status === 200) {
            const _body = await response.json();
        } else {
            setIsToastVisible(true);
            setMessageToast(response.status + ' : ' + response.message);
        }
    }

    /**
     * Method that handle when the user press enter in the input of the name.
     *
     * @param {Event} event The event.
     */
    function handleKeyDownInput(event) {
        if (event.key === 'Enter') {
            if (!regexName.test(event.target.value)) {
                setErrorNameSheet(true);
                event.target.focus();
                return;
            }
            setErrorNameSheet(false);
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
        setSelectCol(null);
        setSelectRow(null);
        const response = await _updateSheetData(idt_sht, cell, val, '');
        updateLockedCell(cell, false);
    }

    /**
     * Method that get the sheet.
     * Send a request to the server.
     *
     * @returns {BigInt} The id of the sheet.
     */
    async function getSheet() {
        if (sheetExist) return;
        const sheetResponse = await getSheetById(idSheet);
        const sheetBody = await sheetResponse.json();
        const sheetData = sheetBody.data;
        if (sheetResponse.status === 200) {
            document.title = `Feuille - ${sheetData.sht_name}`;
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
            setIsLoading(false);
            return sheetData.sht_idtsht;
        }
        setIsLoading(false);
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
        if (!regexName.test(event.target.value)) {
            setErrorNameSheet(true);
        } else {
            setErrorNameSheet(false);
        }
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

        updateLockedCell(nameCol + '_' + nameRow, true);
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
        const td = document.getElementById(cellKey);
        if (td) {
            const divChild = td.querySelector('div');
            if (divChild) {
                divChild.innerText = content;
            }
        }
    }

    const handleToastTimeoutEnd = () => {
        console.log('test');
        setIsToastVisible(false);
    };

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TailSpin color="red" radius={'8px'} />
            </div>
        );
    } else if (!sheetExist && !isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: '20px',
                        marginBottom: '20px',
                        marginTop: '20px',
                    }}
                >
                    Cette feuille n'existe pas ou vous n'y avez pas accès !
                </div>

                <div>
                    Go back to real life : <Link to={'/'}>Home</Link>
                </div>
            </div>
        );
    } else {
        return (
            <>
                {' '}
                {isToastVisible && (
                    <Toast
                        error={true}
                        message={messageToast}
                        onTimeoutEnd={handleToastTimeoutEnd}
                    />
                )}
                <input
                    className={
                        errorNameSheet
                            ? 'sht-input-name sht-input-name-error'
                            : 'sht-input-name '
                    }
                    value={nameSheet}
                    onChange={nameSheetChange}
                    onClick={handleSelectAllInput}
                    onBlur={renameSheet}
                    onKeyDown={handleKeyDownInput}
                ></input>
                {errorNameSheet && (
                    <span className="sht-error-message">
                        Un ou des caractères ne sont pas acceptés.
                    </span>
                )}
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
                                                            nameCol +
                                                                '_' +
                                                                nameRow,
                                                        )
                                                    }
                                                    onPaste={(event) =>
                                                        handlePaste(
                                                            event,
                                                            nameCol +
                                                                '_' +
                                                                nameRow,
                                                        )
                                                    }
                                                    onFocus={(event) =>
                                                        handleSelectAll(
                                                            event,
                                                            nameCol,
                                                            nameRow,
                                                        )
                                                    }
                                                    onDoubleClick={
                                                        handleSelectAll
                                                    }
                                                    onBlur={(event) =>
                                                        updateSheetData(
                                                            nameCol +
                                                                '_' +
                                                                nameRow,
                                                            event.target
                                                                .innerText,
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
}
