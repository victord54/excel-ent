import { getLoggedUser } from './user-service';

export function saveToken(token) {
    localStorage.setItem('auth_token', token);
}

export function removeToken() {
    localStorage.removeItem('auth_token');
}

export function isLogged() {
    const token = localStorage.getItem('auth_token');
    return (token !== null || token !== undefined) && getLoggedUser() !== null;
}

export function getToken() {
    if (isLogged()) return localStorage.getItem('auth_token');
    return null;
}

export function getBearerString() {
    return 'Bearer ' + getToken();
}
