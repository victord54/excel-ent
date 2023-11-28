import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Renvoie une fonction permettant de gérer les erreurs d'authentification de l'API.
 *
 * La fonction prend un paramètre une promesse qui exécute une requête faire l'API
 * et lui ajoute une vérification afin de vérifier si l'utilisateur est toujours connecté.
 *
 * Si non, on le redirige vers la page d'accueil et on le déconnecte au niveau du context d'authenfication.
 *
 * Voir exemple : Profile.jsx
 */
export function useQuery() {
    const { logoutContext } = useContext(AuthContext);
    const navigate = useNavigate();

    return (requestPromise) => {
        return requestPromise.catch((err) => {
            if (err.message === 'Unauthorized') {
                console.log('fsdfs');
                logoutContext();
                navigate('/');
            } else {
                throw err;
            }
        });
    };
}
