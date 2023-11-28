import React, { useState, useEffect, useContext } from 'react';
import './listing.css';
import { useNavigate } from 'react-router-dom';
import boutonModifier from '../../../assets/bouton-modifier.png';
import boutonSupprimer from '../../../assets/bouton-supprimer.png';
import boutonPartager from '../../../assets/bouton-partager.png';
import { v4 as uuid } from 'uuid';
import { getAllSheetFromUser } from '../../../services/api-service';
import { AuthContext } from '../../../contexts/AuthContext';
import { saveSheet as _saveSheet } from '../../../services/api-service';

// TODO : Ajouter les fonctionnalités modifier, supprimer et partager
// TODO : Ajouter la fonctionnalité de recherche
// TODO : Récupérer les feuilles partagées
// TODO : Fonctionnalité de tri

export default function Listing() {
    useEffect(() => {
        document.title = 'Mes feuilles';
        getFeuilles();
    }, []);
    const { user, setUser } = useContext(AuthContext);

    const [feuilles, setFeuilles] = useState([]);
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        console.log(filter);
    };

    async function getFeuilles() {
        const res = await getAllSheetFromUser();
        const _body = await res.json();
        setFeuilles(_body);
        console.log(_body);
    }

    const filteredFeuilles = feuilles.filter((feuille) => {
        if (selectedFilter === 'all') {
            return true;
        } else if (selectedFilter === 'mesFeuilles') {
            return feuille.auteur === 'moa';
        } else if (selectedFilter === 'feuillesPartagees') {
            return feuille.auteur !== 'moa';
        }
    });

    const handleRowClick = (feuille) => {
        console.log(feuille.sht_uuid);
        navigate('/sheet/' + feuille.sht_uuid);
    };

    const modifier = (e, feuille) => {
        e.stopPropagation();
        console.log('Modifier');
    };

    const supprimer = (e, euille) => {
        e.stopPropagation();
        console.log('Supprimer');
    };

    const partager = (e, feuille) => {
        e.stopPropagation();
        console.log('Partager');
    };

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
            setFeuilles([
                ...feuilles,
                {
                    sht_uuid: newUuid,
                    sht_name: 'Sans Nom',
                    sht_created_at: new Date(),
                    sht_updated_at: new Date(),
                },
            ]);
            window.open(`/sheet/${newUuid}`);
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
            <div className="container-home">
                <div className="panneau-gauche">
                    <div>
                        <button
                            onClick={newSheet}
                            className="button-nouvelle-feuille"
                        >
                            Nouvelle feuille
                        </button>
                    </div>
                    <hr className="barre" />
                    <div>
                        <button
                            className={`filter-button ${
                                selectedFilter === 'all' ? 'active' : ''
                            }`}
                            onClick={() => handleFilterClick('all')}
                        >
                            Afficher tout
                        </button>
                        <button
                            className={`filter-button ${
                                selectedFilter === 'mesFeuilles' ? 'active' : ''
                            }`}
                            onClick={() => handleFilterClick('mesFeuilles')}
                        >
                            Afficher mes feuilles
                        </button>
                        <button
                            className={`filter-button ${
                                selectedFilter === 'feuillesPartagees'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                handleFilterClick('feuillesPartagees')
                            }
                        >
                            Afficher les feuilles partagées
                        </button>
                    </div>
                </div>
                <div className="panneau-droit">
                    <div className="table-container">
                        <table className="table-feuilles">
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
                                {filteredFeuilles.map((feuille, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => handleRowClick(feuille)}
                                    >
                                        <td>{feuille.sht_name}</td>
                                        <td>{user.usr_pseudo}</td>
                                        <td>
                                            {reformatDate(
                                                feuille.sht_created_at,
                                            )}
                                        </td>
                                        <td>
                                            {reformatDate(
                                                feuille.sht_updated_at,
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="button-option modifier"
                                                title="Modifier le nom"
                                                onClick={(e) =>
                                                    modifier(e, feuille)
                                                }
                                            >
                                                <img
                                                    src={boutonModifier}
                                                    width="15px"
                                                />
                                            </button>
                                            <button
                                                className="button-option supprimer"
                                                title="Supprimer la feuille"
                                                onClick={(e) =>
                                                    supprimer(e, feuille)
                                                }
                                            >
                                                <img
                                                    src={boutonSupprimer}
                                                    width="15px"
                                                />
                                            </button>
                                            <button
                                                className="button-option partager"
                                                title="Partager la feuille"
                                                onClick={(e) =>
                                                    partager(e, feuille)
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
