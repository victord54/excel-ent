export function saveToken(token) {
    localStorage.setItem('auth_token', token);
}

export function removeToken() {
    localStorage.removeItem('auth_token');
}

export function isLogged() {
    const token = localStorage.getItem('auth_token');
    return !!token;
}

export function getToken() {
    return localStorage.getItem('auth_token');
}

export function getBearerString() {
    return 'Bearer ' + getToken();
}
