import { getLoggedUser } from './user-service';

/**
 * Enregistre le jeton d'authentification.
 *
 * @param {string} token - Le jeton d'authentification à enregistrer.
 */
export function saveToken(token) {
    localStorage.setItem('auth_token', token);
}

/**
 * Supprime le jeton d'authentification.
 */
export function removeToken() {
    localStorage.removeItem('auth_token');
}

/**
 * Vérifie si l'utilisateur est connecté.
 *
 * @return {boolean} true si l'utilisateur est connecté, false sinon.
 */
export function isLogged() {
    const token = localStorage.getItem('auth_token');
    return token && getExpirationDate(token) > new Date() && getLoggedUser();
}

/**
 * Récupère le jeton d'authentification.
 *
 * @return {string|null} Le jeton d'authentification, ou null si l'utilisateur n'est pas connecté.
 */
export function getToken() {
    if (isLogged()) return localStorage.getItem('auth_token');
    return null;
}

/**
 * Récupère la chaîne d'authentification Bearer.
 *
 * @return {string} La chaîne Bearer d'authentification.
 */
export function getBearerString() {
    return 'Bearer ' + getToken();
}

/**
 * Récupère la date d'expiration d'un JSON Web Token (JWT).
 *
 * @param {string} jwt - Le JWT dont on souhaite récupérer la date d'expiration.
 * @returns {Date} La date d'expiration du JWT.
 */
function getExpirationDate(jwt) {
    const tokenParts = jwt.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    const expirationDate = new Date(payload.exp * 1000);
  
    return expirationDate;
}
