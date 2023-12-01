import React, { useState } from 'react';
import './popup.css';

function PopUp({ onAction, type, link, alreadyShared }) {
    function handleAnnuler() {
        onAction(false);
    }

    function handleConfirmer() {
        if (type === 'confirmShare' && alreadyShared) onAction(false);
        else onAction(true);
    }

    function handleClickCopieLink() {
        navigator.clipboard.writeText(window.location.href + '/' + link);
        document.getElementById('popup-confirmation').className =
            'popup-link-container-visible';
    }

    return (
        <div className="popup-container">
            <div className="popup-title">
                {type === 'confirmDelete'
                    ? 'Supprimer la feuille'
                    : 'Partager la feuille'}
            </div>
            <div className="popup-container-content">
                <div className="popup-content">
                    {type === 'confirmDelete'
                        ? 'Êtes-vous sûr de vouloir supprimer cet élément ?'
                        : alreadyShared
                        ? 'Vous avez déjà partagé ce document.'
                        : 'Êtes-vous sûr de vouloir partager ce document ?'}
                </div>
                <div className="popup-container-buttons">
                    <div>
                        <button
                            className="popup-button popup-confirmer"
                            onClick={handleConfirmer}
                        >
                            {type === 'confirmShare' && alreadyShared
                                ? 'Ok'
                                : 'Confirmer'}
                        </button>
                    </div>
                    <div>
                        {!alreadyShared ? (
                            <button
                                className="popup-button popup-annuler"
                                onClick={handleAnnuler}
                            >
                                Annuler
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                    {type === 'confirmShare' ? (
                        <div>
                            <button
                                className="popup-button popup-link"
                                onClick={handleClickCopieLink}
                            >
                                Copier le lien
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div
                    className="popup-link-container-hidden"
                    id="popup-confirmation"
                >
                    Lien copié !
                </div>
            </div>
        </div>
    );
}

export default PopUp;
