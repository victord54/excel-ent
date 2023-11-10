import { isLogged, removeToken } from "./auth-service";

export function getLoggedUser(){
    if(isLogged()){
        const user = JSON.parse(localStorage.getItem('loged_user'));
        if(user){
            return user;
        }else{
            removeToken();
            return null;
        }
    }
    removeToken();
    return null;
}

export function setLoggedUser(user){
    localStorage.setItem('loged_user', JSON.stringify(user));
    return true;
}