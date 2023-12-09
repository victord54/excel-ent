import React, { useState, useEffect, useContext } from 'react';
import './listing.css';
import { useNavigate } from 'react-router-dom';
import boutonModifier from '../../../assets/bouton-modifier.png';
import boutonSupprimer from '../../../assets/bouton-supprimer.png';
import boutonPartager from '../../../assets/bouton-partager.png';
import { v4 as uuid } from 'uuid';
import { getAllSheetFromUser } from '../../../services/api-service';
import { AuthContext } from '../../../contexts/AuthContext';
import {
    saveSheet as _saveSheet,
    renameSheet as _renameSheet,
    deleteSheet as _deleteSheet,
    createLink as _createLink,
} from '../../../services/api-service';
import PopUp from '../../../components/private/pop-up/PopUp';

export default function Listing() {
    useEffect(() => {
        document.title = 'Mes feuilles';
        getSheets();
    }, []);
    const { user } = useContext(AuthContext);
    const [sheets, setSheets] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [canRowClick, setCanRowClick] = useState(true);
    const [isPopupDeleteOpen, setIsPopupDeleteOpen] = useState(false);
    const [isPopupShareOpen, setIsPopupShareOpen] = useState(false);
    const [sheetToDeleteOrShare, setSheetToDeleteOrShare] = useState(null);
    const [sortedBy, setSortedBy] = useState('last_update');

    /**
     * Method that handle the filter selected.
     *
     * @param {String} filter The name of the filter to apply.
     */
    const handleFilter = (filter) => {
        if (filter === '') filter = 'all';
        setSelectedFilter(filter);
    };

    /**
     * Method that get all sheets from the user.
     * Send a request to the server to get all the sheets.
     */
    async function getSheets() {
        // TODO : error
        const res = await getAllSheetFromUser();
        const _body = await res.json();
        setSheets(_body);
    }

    /**
     * Method that filter the sheets.
     */
    const filteredSheets = sheets.filter((sheet) => {
        if (selectedFilter === 'all') {
            return true;
        } else if (selectedFilter === 'mySheets') {
            return sheet.sht_idtusr_aut === user.usr_idtusr;
        } else if (selectedFilter === 'sheetsShared') {
            return sheet.sht_idtusr_aut !== user.usr_idtusr;
        } else {
            return removeAccents(sheet.sht_name.toLowerCase()).includes(
                removeAccents(selectedFilter.toLowerCase()),
            );
        }
    });

    /**
     * Method that remove accents from a string.
     *
     * @param {String} str The string to remove accents.
     * @returns str without accents.
     */
    function removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Method that handle the click on a row. Relocate the user to the sheet.
     *
     * @param {Object} sheet The sheet clicked.
     */
    const handleRowClick = (sheet) => {
        if (!canRowClick) return;
        window.open('/sheet/' + sheet.sht_uuid, '_blank');
    };

    /**
     * Method that handle the click on the rename button.
     *
     * @param {Event} event The event.
     * @param {Object} sheet The sheet to rename.
     */
    async function handleRenameSheetClick(event, sheet) {
        event.stopPropagation();
        setCanRowClick(false);
        const td = document.getElementById(sheet.sht_idtsht + '_Name');
        td.contentEditable = true;
        td.className = 'sht-sheet-title-editable';

        // Sélection du contenu de la td
        const range = document.createRange();
        range.selectNodeContents(td);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Method that handle when the user has finished to rename the sheet.
     * Send the request to the server to rename the sheet.
     *
     * @param {Event} event The event.
     * @param {Object} sheet The sheet to rename.
     */
    async function handleOnBlurRenameSheet(event, sheet) {
        if (event.target.contentEditable === 'false') return;
        const regex = /^[a-z\sA-Z0-9*'()_\-/À-ÖØ-öø-ÿ]+$/;
        const idt_sht = sheet.sht_idtsht;
        const td = event.target;
        td.contentEditable = false;
        td.className = 'sht-sheet-title';

        if (td.innerText === sheet.sht_name) return;

        if (!regex.test(td.innerText)) {
            td.innerText = sheet.sht_name;
            // TODO : Afficher l'error (caractères interdits)
            return;
        }
        setCanRowClick(true);

        // TODO : error
        const response = await _renameSheet(idt_sht, td.innerText);

        if (response.status === 200) {
            console.log('ok :' + td.innerText);
            const _body = await response.json();
            console.log(_body);

            setSheets((prevSheets) => {
                return prevSheets.map((sheet) => {
                    if (sheet.sht_idtsht === idt_sht) {
                        // Si l'id correspond, met à jour le nom
                        return { ...sheet, sht_name: td.innerText };
                    }
                    // Sinon, retourne l'objet sheet sans modification
                    return sheet;
                });
            });
        }
    }

    /**
     * Method that handle when the user press enter when renaming a sheet.
     *
     * @param {Event} event The event.
     * @param {Object} sheet The sheet.
     */
    function handleEnterDown(event, sheet) {
        if (event.target.contentEditable === 'false') return;
        if (event.key === 'Enter') {
            handleOnBlurRenameSheet(event, sheet);
        }
    }

    /**
     * Method that handle the confirmation of the popup to delete a sheet.
     * Send the request to the server to delete the sheet if the user has confirm.
     *
     * @param {boolean} confirm The confirmation.
     */
    async function handlePopUpConfirmationSupprimer(confirm) {
        setIsPopupDeleteOpen(false);

        if (confirm) {
            const res = await _deleteSheet(sheetToDeleteOrShare.sht_idtsht);
            //TODO : error
            if (res.status === 200) {
                const _body = await res.json();
                setSheets((prevSheets) => {
                    const updatedSheets = prevSheets.filter(
                        (f) => f.sht_idtsht !== sheetToDeleteOrShare.sht_idtsht,
                    );
                    return updatedSheets;
                });
            }
        }
        setSheetToDeleteOrShare(null);
    }

    /**
     * Method that handle the click on the delete button.
     *
     * @param {Event} e The event.
     * @param {Object} sheet The sheet.
     */
    function deleteSheet(e, sheet) {
        e.stopPropagation();
        setSheetToDeleteOrShare(sheet);
        setIsPopupDeleteOpen(true);
    }

    /**
     * Method that handle the confirmation of the popup to share a sheet.
     * Send the request to the server to create a sharing link if the user has confirm.
     *
     * @param {boolean} confirm
     */
    async function handlePopUpConfirmationShare(confirm) {
        setIsPopupShareOpen(false);

        if (confirm) {
            const response = await _createLink(
                sheetToDeleteOrShare.sht_idtsht,
                sheetToDeleteOrShare.link,
            );
            if (response.status === 200) {
                console.log(response);
            }
            // TODO :error
        }

        setSheetToDeleteOrShare(null);
    }

    /**
     * Method that handle the click on the share button.
     *
     * @param {Event} e The event.
     * @param {Object} sheet The sheet.
     */
    function shareSheet(e, sheet) {
        e.stopPropagation();
        sheet.link = generateLink(sheet.sht_idtsht);
        setSheetToDeleteOrShare(sheet);
        setIsPopupShareOpen(true);
    }

    /**
     * Method that create a new sheet and redirect the user to the sheet.
     */
    async function newSheet() {
        let newUuid = uuid();
        let response = await _saveSheet({
            sht_uuid: newUuid,
            sht_name: 'Sans Nom',
            sht_data: JSON.stringify({}),
            sht_sharing: 0,
            sht_idtsht: null,
        });
        let _body = await response.json();
        console.log(_body);
        if (response.status === 409) {
            console.log('conflict');
            newUuid = uuid();
            response = await _saveSheet({
                sht_uuid: newUuid,
                sht_name: 'Sans Nom',
                sht_data: JSON.stringify({}),
                sht_sharing: 0,
                sht_idtsht: null,
            });
            _body = await response.json();
            console.log(_body);
        }
        if (response.status === 200) {
            console.log('ok');
            setSheets([
                ...sheets,
                {
                    sht_idtusr_aut: user.usr_idtusr,
                    sht_idtsht: _body.sht_idtsht,
                    sht_uuid: newUuid,
                    sht_name: 'Sans Nom',
                    sht_created_at: new Date(),
                    sht_updated_at: new Date(),
                    sht_sharing: 0,
                },
            ]);

            if (sortedBy === 'last_update') sortByDate();
            else if (sortedBy === 'name') sortByName();
            else if (sortedBy === 'author') sortByAuthor();

            window.open(`/sheet/${newUuid}`, '_blank');
        }
    }

    /**
     * Method that reformat a date to the format "dd/mm/yyyy à hh:mm".
     *
     * @param {Date} date The date to reformat.
     * @returns date in the format "dd/mm/yyyy à hh:mm".
     */
    function reformatDate(date) {
        const dateObject = new Date(date);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');

        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');

        const formattedDateTime = `${day}/${month}/${year} à ${hours}h${minutes}`;

        return formattedDateTime;
    }

    /**
     * Method that sort the sheets by author.
     */
    function sortByAuthor() {
        setSortedBy('author');
        const sortedSheets = [...sheets].sort((sheet1, sheet2) =>
            sheet1.sht_name.localeCompare(sheet2.sht_name),
        );
        setSheets(sortedSheets);
    }

    /**
     * Method that sort the sheets by date.
     */
    function sortByDate() {
        setSortedBy('last_update');
        const sortedSheets = [...sheets].sort(
            (sheet1, sheet2) =>
                new Date(sheet1.sht_updated_at) -
                new Date(sheet2.sht_updated_at),
        );
        setSheets(sortedSheets);
    }

    /**
     * Method that sort the sheets by name.
     */
    function sortByName() {
        setSortedBy('name');
        const sortedSheets = [...sheets].sort((sheet1, sheet2) =>
            sheet1.sht_name.localeCompare(sheet2.sht_name),
        );
        setSheets(sortedSheets);
    }

    /**
     * Method that generate a sharing link.
     *
     * @param {BigInt} sht_idtsht
     * @returns The generated link.
     */
    function generateLink(sht_idtsht) {
        const charset =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-&_';
        let randomString = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset.charAt(randomIndex);
        }
        const randomIndex = Math.floor(
            Math.random() * (randomString.length + 1),
        );
        const urlPart1 = randomString.substring(0, randomIndex);
        const urlPart2 = randomString.substring(randomIndex);
        const url = `${urlPart1}e&${sht_idtsht}${urlPart2}`;
        return url;
    }

    return (
        <>
            {isPopupDeleteOpen && (
                <div className="sht-popup">
                    <PopUp
                        onAction={handlePopUpConfirmationSupprimer}
                        type="confirmDelete"
                    />
                </div>
            )}
            {isPopupShareOpen && (
                <div className="sht-popup">
                    <PopUp
                        onAction={handlePopUpConfirmationShare}
                        type="confirmShare"
                        link={sheetToDeleteOrShare.link}
                    />
                </div>
            )}
            <div className="sht-container-home">
                <div className="sht-pannel-left">
                    <div>
                        <button
                            onClick={newSheet}
                            className="sht-button-new-sheet"
                            title="Créer une nouvelle feuille"
                        >
                            Nouvelle feuille
                        </button>
                    </div>
                    <hr className="sht-line" />
                    <div>
                        <button
                            className={`sht-filter-button ${
                                selectedFilter === 'all' ? 'sht-active' : ''
                            }`}
                            title="Afficher toutes les feuilles"
                            onClick={() => handleFilter('all')}
                        >
                            Afficher tout
                        </button>
                        <button
                            className={`sht-filter-button ${
                                selectedFilter === 'mySheets'
                                    ? 'sht-active'
                                    : ''
                            }`}
                            title="Afficher les feuilles dont je suis l'auteur"
                            onClick={() => handleFilter('mySheets')}
                        >
                            Afficher mes feuilles
                        </button>
                        <button
                            className={`sht-filter-button ${
                                selectedFilter === 'sheetsShared'
                                    ? 'sht-active'
                                    : ''
                            }`}
                            title="Afficher les feuilles dont je ne suis pas l'auteur"
                            onClick={() => handleFilter('sheetsShared')}
                        >
                            Afficher les feuilles partagées
                        </button>
                    </div>
                    <div className="sht-research-container">
                        <input
                            type="text"
                            placeholder="Rechercher"
                            onInput={(e) => handleFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="sht-pannel-right">
                    <div className="sht-table-container">
                        <table className="sht-table-sheets">
                            <thead>
                                <tr>
                                    <th onClick={sortByName}>Nom</th>
                                    <th onClick={sortByAuthor}>Auteur</th>
                                    <th onClick={sortByDate}>
                                        Date de modification
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSheets.map((sheet, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => handleRowClick(sheet)}
                                        className="sht-sheet-row-container"
                                    >
                                        <td
                                            contentEditable={false}
                                            id={sheet.sht_idtsht + '_Name'}
                                            onBlur={(event) =>
                                                handleOnBlurRenameSheet(
                                                    event,
                                                    sheet,
                                                )
                                            }
                                            onKeyDown={(event) =>
                                                handleEnterDown(event, sheet)
                                            }
                                            title={sheet.sht_name}
                                            className="sht-sheet-title"
                                        >
                                            {sheet.sht_name}
                                        </td>
                                        <td>{sheet.usr_pseudo}</td>
                                        <td className="sht-sheet-date">
                                            {reformatDate(sheet.sht_updated_at)}
                                        </td>
                                        <td>
                                            <button
                                                className="sht-button-option sht-rename"
                                                title="Modifier le nom"
                                                onClick={(e) =>
                                                    handleRenameSheetClick(
                                                        e,
                                                        sheet,
                                                    )
                                                }
                                            >
                                                <img
                                                    src={boutonModifier}
                                                    width="15px"
                                                />
                                            </button>
                                            {sheet.sht_idtusr_aut ===
                                            user.usr_idtusr ? (
                                                <button
                                                    className="sht-button-option sht-delete"
                                                    title="Supprimer la sheet"
                                                    onClick={(e) =>
                                                        deleteSheet(e, sheet)
                                                    }
                                                >
                                                    <img
                                                        src={boutonSupprimer}
                                                        width="15px"
                                                    />
                                                </button>
                                            ) : (
                                                <></>
                                            )}

                                            <button
                                                className="sht-button-option sht-share"
                                                title="Partager la sheet"
                                                onClick={(e) =>
                                                    shareSheet(e, sheet)
                                                }
                                            >
                                                <img
                                                    src={boutonPartager}
                                                    width="15px"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
