import React, { useEffect } from 'react';
import './home.css';

export default function Home() {
    useEffect(() => {
        document.title = 'Tableur Collaboratif';
    }, []);

    return (
        <div className="home-container">
            <div className="home-title">
                <h1>Tableur Collaboratif</h1>
                <p>Bienvenue sur notre plateforme de tableur collaboratif.</p>
            </div>

            <section className="home-features">
                <div className="home-feature">
                    <h2>Fonctionnalités</h2>
                    <ul>
                        {/* <li>Collaboration en temps réel</li> */}
                        <li>Partage facile de feuilles de calcul</li>
                        <li>Et bien plus encore...</li>
                    </ul>
                </div>

                <div className="home-feature">
                    <h2>Comment ça marche</h2>
                    <p>
                        Il vous suffit de créer un compte, de créer ou de
                        rejoindre une feuille de calcul, et commencez à
                        collaborer avec vos collègues.
                    </p>
                </div>
            </section>

            <footer>
                <p>&copy; 2023 Tableur Collaboratif</p>
            </footer>
        </div>
    );
}
