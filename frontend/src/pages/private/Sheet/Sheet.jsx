import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './sheet.css';
import { evaluateur } from '../../../services/evaluateur';

export default function Sheet() {
    let { uuidSheet } = useParams();
    const numberOfRows = 100;
    const numberOfColumns = 30;
    const [cells, setCells] = useState([]);
    const [nameSheet, setNameSheet] = useState('Sans Nom');

    const nameRows = Array.from(
        { length: numberOfRows },
        (_, index) => index + 1,
    );
    const nameColums = generateNameColumns();

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

    function handleInputChange(event, cellKey) {
        const updatedCells = { ...cells };
        updatedCells[cellKey] = event.target.innerText;
        setCells(updatedCells);
    }

    function saveSheet() {
        console.log('save');
        console.log(cells);
    }

    function handleKeyDown(event, cellKey) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const res = evaluateur(cells[cellKey]);
            setCells({ ...cells, [cellKey]: res });
            event.target.innerText = res;
            event.target.blur();
        }
        if (event.ctrlKey && event.key === 'c') {
            handleCopy();
        }
    }

    function handleCopy() {
        console.log('copy');
        const selection = window.getSelection();
        const copiedText = selection.focusNode.nodeValue;
        navigator.clipboard.writeText(copiedText);
    }

    function handlePaste(event, keyCell) {
        console.log('paste');
        const text = event.clipboardData.getData('text/plain');
        setCells({ ...cells, [keyCell]: text });
    }

    function nameSheetChange(event) {
        setNameSheet(event.target.value);
    }

    function handleSelectAll(event) {
        event.target.select();
    }

    return (
        <>
            <input
                className="sht-input-name"
                value={nameSheet}
                onChange={nameSheetChange}
                onClick={handleSelectAll}
            ></input>
            <button onClick={saveSheet}>Save</button>
            <div className="sht-container-all">
                <div className="sht-container-tab">
                    <table className="sht-table">
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
                                    {nameColums.map((nameCol) => (
                                        <td
                                            key={nameCol + '_' + nameRow}
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
                                        ></td>
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
