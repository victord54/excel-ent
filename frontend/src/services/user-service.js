export function getLoggedUser() {
    const user = JSON.parse(localStorage.getItem('loged_user'));
    if (user) {
        return user;
    }
    return null;
}

export function setLoggedUser(user) {
    localStorage.setItem('loged_user', JSON.stringify(user));
    return true;
}

export function removeLoggedUser() {
    localStorage.removeItem('loged_user');
}
