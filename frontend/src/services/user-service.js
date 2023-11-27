export function getLoggedUser() {
    const userJSON = localStorage.getItem('loged_user');
    if (userJSON) {
        try{
            const user = JSON.parse(userJSON);
            return user;
        }catch{
            return null;
        }
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
