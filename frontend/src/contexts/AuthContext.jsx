import { createContext, useCallback, useEffect, useState } from "react"
import { isLogged, removeToken, saveToken } from "../services/auth-service";
import { getLoggedUser, setLoggedUser } from "../services/user-service";

export const AuthContext = createContext({ loged: false, loginContext: (token) => {}, logoutContext: () => {}, user: null});

export const AuthContextProvider = ({defaultValue, children}) => {
    const [data, setData] = useState(defaultValue);

    const loginContext = useCallback((token, user) => {
        saveToken(token);
        setLoggedUser(user);
        setData((prevData) => ({
            ...prevData,
            loged: true,
            user: user
        }));
    }, []);
    

    const logoutContext = useCallback(() => {
        removeToken();
        setData((prevData) => ({
            ...prevData,
            loged: false,
            user: null
        }));
    }, []); 

    const setUser = useCallback((user) => {
        setLoggedUser(user);
        setData((prevData) => ({
            ...prevData,
            user: user
        }));
    }, []);

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            user: getLoggedUser(),
            loged: isLogged(),
            setUser: setUser,
            loginContext: loginContext,
            logoutContext: logoutContext
        }));
    }, []);

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}