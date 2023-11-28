import { Link } from 'react-router-dom';
import './top-bar.css';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

export default function TopBar() {
    const { logged, logoutContext } = useContext(AuthContext);

    return (
        <header>
            <nav>
                <Link to="/" className="header-name">
                    Excel-ent
                </Link>
                <ul>
                    {logged ? (
                        <>
                            <li>
                                <Link to="/sheet">Mes feuilles</Link>
                            </li>
                            <li>
                                <Link to="/profile">Mon profil</Link>
                            </li>
                            <li>
                                <a
                                    href=""
                                    onClick={(e) => {
                                        e.preventDefault();
                                        logoutContext();
                                        window.location.href = '/';
                                    }}
                                >
                                    Déconnexion
                                </a>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/auth">Inscription/Connexion</Link>
                        </li>
                    )}
                    {/* <li>
                        {logged ? (
                            <Link to="/profile">Mon profil</Link>
                        ) : (
                            <Link to="/auth">Inscription/Connexion</Link>
                        )}
                    </li>
                    {logged && (
                        <li>
                            <a
                                href={''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    logoutContext();
                                }}
                            >
                                Deconnexion
                            </a>
                        </li>
                    )} */}
                </ul>
            </nav>
        </header>
    );
}
