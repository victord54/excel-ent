import { decodeToken } from 'react-jwt';

/**
 * Récupère l'utilisateur connecté.
 *
 * @returns {Object|null} L'utilisateur connecté ou null s'il n'est pas trouvé.
 */
export function getLoggedUser() {
    const token = localStorage.getItem('auth_token');
    if (token != null) {
        return decodeToken(token);
    }
    return null;
}

/**
 * Supprime l'utilisateur connecté.
 */
export function removeLoggedUser() {
    localStorage.removeItem('auth_token');
}
