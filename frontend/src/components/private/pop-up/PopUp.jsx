import React, { useState } from 'react';
import './popup.css';

function PopUp({ onAction, type }) {
    function handleAnnuler() {
        onAction(false);
    }

    function handleConfirmer() {
        onAction(true);
    }

    return (
        <div className="popup-container">
            <div className="popup-title">
                {type === 'confirm' ? 'Confirmation' : 'Erreur'}
            </div>
            <div className="popup-container-content">
                <div className="popup-content">
                    {type === 'confirm'
                        ? 'Êtes-vous sûr de vouloir supprimer cet élément ?'
                        : 'Une erreur est survenue.'}
                </div>
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
