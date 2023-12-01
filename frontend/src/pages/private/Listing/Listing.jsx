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
} from '../../../services/api-service';
import PopUp from '../../../components/private/pop-up/PopUp';

// TODO : Ajouter les fonctionnalités modifier, supprimer et partager
// TODO : Ajouter la fonctionnalité de recherche
// TODO : Récupérer les sheets partagées
// TODO : Fonctionnalité de tri

export default function Listing() {
    useEffect(() => {
        document.title = 'Mes feuilles';
        getSheets();
    }, []);
    const { user } = useContext(AuthContext);
    const [sheets, setSheets] = useState([]);
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [canRowClick, setCanRowClick] = useState(true);
    const [isPopupDeleteOpen, setIsPopupDeleteOpen] = useState(false);
    const [isPopupShareOpen, setIsPopupShareOpen] = useState(false);
    const [sheetToDeleteOrShate, setSheetToDeleteOrShare] = useState(null);

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        console.log(filter);
    };

    async function getSheets() {
        const res = await getAllSheetFromUser();
        const _body = await res.json();
        setSheets(_body);
        console.log(_body);
    }

    const filteredSheets = sheets.filter((sheet) => {
        if (selectedFilter === 'all') {
            return true;
        } else if (selectedFilter === 'mySheets') {
            return sheet.sht_idtusr_aut === user.usr_idtusr;
        } else if (selectedFilter === 'sheetsShared') {
            return sheet.sht_idtusr_aut !== user.usr_idtusr;
        }
    });

    const handleRowClick = (sheet) => {
        if (!canRowClick) return;
        console.log(sheet.sht_uuid);
        window.open('/sheet/' + sheet.sht_uuid, '_blank');
    };

    async function handleRenamesheetClick(event, sheet) {
        event.stopPropagation();
        setCanRowClick(false);
        const td = document.getElementById(sheet.sht_idtsht + '_Name');
        td.contentEditable = true;

        // Sélection du contenu de la td
        const range = document.createRange();
        range.selectNodeContents(td);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    async function handleOnBlurRenameSheet(event, sheet) {
        console.log('ok');
        const idt_sht = sheet.sht_idtsht;
        const td = event.target;
        td.contentEditable = false;
        setCanRowClick(true);
        // TODO : error
        const response = await _renameSheet(idt_sht, td.innerText);

        if (response.status === 200) {
            console.log('ok');
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

    function handleEnterDown(event, sheet) {
        if (event.key === 'Enter') {
            handleOnBlurRenameSheet(event, sheet);
            const selection = window.getSelection();
            selection.removeAllRanges();
            event.target.blur();
        }
    }

    async function handlePopUpConfirmationSupprimer(confirm) {
        setIsPopupDeleteOpen(false);

        if (confirm) {
            const res = await _deleteSheet(sheetToDeleteOrShate.sht_idtsht);

            //TODO : error
            if (res.status === 200) {
                const _body = await res.json();
                console.log(_body);
                setSheets((prevSheets) => {
                    const updatedSheets = prevSheets.filter(
                        (f) => f.sht_idtsht !== sheetToDeleteOrShate.sht_idtsht,
                    );
                    return updatedSheets;
                });
            }
        }
        setSheetToDeleteOrShare(null);
    }

    function deleteSheet(e, sheet) {
        e.stopPropagation();
        console.log('Supprimer');
        setSheetToDeleteOrShare(sheet);
        setIsPopupDeleteOpen(true);
    }

    async function handlePopUpConfirmationShare(confirm) {
        setIsPopupShareOpen(false);

        if (confirm) {
            console.log('Partage confirmer');
            // TODO : Partager la sheet
        }

        setSheetToDeleteOrShare(null);
    }

    function shareSheet(e, sheet) {
        e.stopPropagation();
        console.log('Partager');
        setSheetToDeleteOrShare(sheet);
        setIsPopupShareOpen(true);
    }

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
                    sht_uuid: newUuid,
                    sht_name: 'Sans Nom',
                    sht_created_at: new Date(),
                    sht_updated_at: new Date(),
                },
            ]);
            navigate(`/sheet/${newUuid}`);
        }
        console.log(newUuid);
    }

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
                        link={sheetToDeleteOrShate.sht_uuid}
                        alreadyShared={sheetToDeleteOrShate.sht_sharing}
                    />
                </div>
            )}
            <div className="sht-container-home">
                <div className="sht-pannel-left">
                    <div>
                        <button
                            onClick={newSheet}
                            className="sht-button-new-sheet"
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
                            onClick={() => handleFilterClick('all')}
                        >
                            Afficher tout
                        </button>
                        <button
                            className={`sht-filter-button ${
                                selectedFilter === 'mySheets'
                                    ? 'sht-active'
                                    : ''
                            }`}
                            onClick={() => handleFilterClick('mySheets')}
                        >
                            Afficher mes feuilles
                        </button>
                        <button
                            className={`sht-filter-button ${
                                selectedFilter === 'sheetsShared'
                                    ? 'sht-active'
                                    : ''
                            }`}
                            onClick={() => handleFilterClick('sheetsShared')}
                        >
                            Afficher les feuilles partagées
                        </button>
                    </div>
                </div>
                <div className="sht-pannel-right">
                    <div className="sht-table-container">
                        <table className="sht-table-sheets">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Crée par</th>
                                    <th>Date de création</th>
                                    <th>Date de modification</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSheets.map((sheet, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => handleRowClick(sheet)}
                                    >
                                        <td
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
                                        >
                                            {sheet.sht_name}
                                        </td>
                                        <td>{user.usr_pseudo}</td>
                                        <td>
                                            {reformatDate(sheet.sht_created_at)}
                                        </td>
                                        <td>
                                            {reformatDate(sheet.sht_updated_at)}
                                        </td>
                                        <td>
                                            <button
                                                className="sht-button-option sht-rename"
                                                title="Modifier le nom"
                                                onClick={(e) =>
                                                    handleRenamesheetClick(
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
