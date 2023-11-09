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
    const [draggedCell, setDraggedCell] = useState(null);
    const [editable, setEditable] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

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

    function handleDragStart(event, keyCell) {
        console.log('yeees');
        event.dataTransfer.setData('text/plain', cells[keyCell]);
        setEditable(false);
        setIsDragging(true);
        setCells({ ...cells, [keyCell]: '' });
        setDraggedCell(keyCell);
    }

    function handleDrop(event, keyCell) {
        console.log('drop');
        setIsDragging(false);
        setEditable(true);
        setCells({
            ...cells,
            [keyCell]: event.dataTransfer.getData('text/plain'),
        });

        const td_source = document.getElementById(draggedCell);
        if (td_source) {
            const divChild = td_source.querySelector('div');
            if (divChild) {
                divChild.innerText = '';
            }
        }
        setDraggedCell(null);

        const td_target = document.getElementById(keyCell);
        if (td_target) {
            const divChild = td_target.querySelector('div');
            if (divChild) {
                if (divChild === '')
                    divChild.innerText =
                        event.dataTransfer.getData('text/plain');
            }
        }
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
