import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
    Renvoie une fonction permettant de gérer les erreurs d'authentification de l'API.
    @returns {Function} - Une fonction qui prend en paramètre une promesse exécutant une requête vers l'API et ajoute une vérification de l'état de connexion de l'utilisateur. En cas de déconnexion, l'utilisateur est redirigé vers la page d'accueil et déconnecté au niveau du contexte d'authentification.
    @example
        import { useQuery } from './utils';
        const handleRequest = useQuery();
        handleRequest(apiRequestPromise);
    @see Profile.jsx 
*/
export function useQuery() {
    const { logoutContext } = useContext(AuthContext);
    const navigate = useNavigate();

    return (requestPromise) => {
        return requestPromise.catch((err) => {
            if (err.message === 'Unauthorized') {
                logoutContext();
                navigate('/');
            } else {
                throw err;
            }
        });
    };
}
