import React, { useState } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import boutonModifier from '../../../assets/bouton-modifier.png';
import boutonSupprimer from '../../../assets/bouton-supprimer.png';
import boutonPartager from '../../../assets/bouton-partager.png';

function Home() {
    const f1 = {
        titre: 'test test test test',
        href: 'auth',
        date_creation: '10-12-1997',
        date_modification: '15-12-1997',
        auteur: 'pamoa',
        id: 2,
    };

    const f2 = {
        titre: 'test test test test',
        href: 'auth',
        date_creation: '10-12-1997',
        date_modification: '15-12-1997',
        auteur: 'moa',
        id: 1,
    };

    const [feuilles, setFeuilles] = useState([
        f1,
        f1,
        f2,
        f1,
        f1,
        f1,
        f1,
        f1,
        f1,
        f1,
        f1,
        f2,
        f1,
        f1,
        f1,
        f1,
        f1,
        f2,
        f2,
        f1,
        f1,
        f1,
        f1,
        f2,
        f1,
        f1,
        f1,
        f1,
        f2,
        f2,
        f2,
        f2,
        f2,
        f1,
        f1,
        f1,
        f1,
        f1,
        f1,
        f2,
        f1,
        f1,
        f1,
        f1,
        f1,
        f1,
        f2,
        f2,
        f2,
        f1,
        f1,
        f1,
        f1,
        f2,
        f1,
        f1,
    ]);
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        console.log(filter);
    };

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
        console.log(feuille.href);
        navigate(feuille.href);
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

    return (
        <>
            <div className="container-home">
                <div className="panneau-gauche">
                    <div>
                        <button className="button-nouvelle-feuille">
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
                                        <td>{feuille.titre}</td>
                                        <td>{feuille.auteur}</td>
                                        <td>{feuille.date_creation}</td>
                                        <td>{feuille.date_modification}</td>
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

export default Home;
