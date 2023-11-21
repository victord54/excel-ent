import { createContext, useCallback, useEffect, useState } from 'react';
import { isLogged, removeToken, saveToken } from '../services/auth-service';
import { getLoggedUser } from '../services/user-service';

export const AuthContext = createContext({
    logged: false,
    loginContext: (token) => {},
    logoutContext: () => {},
    user: null,
});

export const AuthContextProvider = ({ defaultValue, children }) => {
    const [data, setData] = useState(defaultValue);

    const loginContext = useCallback((token) => {
        saveToken(token);
        setData((prevData) => ({
            ...prevData,
            logged: true,
            user: getLoggedUser(),
        }));
    }, []);

    const logoutContext = useCallback(() => {
        removeToken();
        removeLoggedUser();
        setData((prevData) => ({
            ...prevData,
            logged: false,
            user: null,
        }));
    }, []);

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            user: getLoggedUser(),
            logged: isLogged(),
            loginContext: loginContext,
            logoutContext: logoutContext,
        }));
    }, []);

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
