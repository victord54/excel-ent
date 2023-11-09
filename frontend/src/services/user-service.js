import { isLogged, removeToken } from "./auth-service";

export function getLoggedUser(){
    if(isLogged()){
        return JSON.parse(localStorage.getItem('loged_user'));
    }
    removeToken();
    return null;
}

export function setLoggedUser(user){
    localStorage.setItem('loged_user', JSON.stringify(user));
    return true;
}