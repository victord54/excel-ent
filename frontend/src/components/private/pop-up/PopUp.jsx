import React, { useState } from 'react';
import './popup.css';
import copierSymbol from '../../../assets/copier.png';

function PopUp({ onAction, type, link }) {
    function handleAnnuler() {
        onAction(false);
    }

    function handleConfirmer() {
        onAction(true);
    }

    function handleClickCopieLink() {
        navigator.clipboard.writeText(window.location.href + '/invite/' + link);
        document.getElementById('popup-confirmation').className =
            'popup-link-container-visible';
        console.log(link);
    }

    function selectAll(e) {
        e.target.select();
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
                        : 'Copiez ce lien afin de le partager et cliquez sur confirmer.'}
                </div>
                {type === 'confirmShare' ? (
                    <div className="popup-copy-link">
                        <input
                            type="text"
                            className="popup-input-link"
                            value={window.location.href + '/invite/' + link}
                            onClick={selectAll}
                            readOnly
                        />
                        <button
                            className="popup-button-link"
                            onClick={handleClickCopieLink}
                            title="Copier le lien"
                        >
                            <img src={copierSymbol}></img>
                        </button>
                        <div
                            className="popup-link-container-hidden"
                            id="popup-confirmation"
                        >
                            Lien copié !
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <div className="popup-container-buttons">
                    <div>
                        <button
                            className="popup-button popup-confirmer"
                            onClick={handleConfirmer}
                        >
                            Confirmer
                        </button>
                    </div>
                    <div>
                        <button
                            className="popup-button popup-annuler"
                            onClick={handleAnnuler}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
