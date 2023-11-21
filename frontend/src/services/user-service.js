import { decodeToken } from 'react-jwt';

export function getLoggedUser() {
    const token = localStorage.getItem('auth_token');
    if (token != null) {
        return decodeToken(token);
    }
    return null;
}

export function removeLoggedUser() {
    localStorage.removeItem('auth_token');
}