import React, {useState, useEffect} from 'react';
import GetCookie from './hooks/getCookie';

export const AuthContext = React.createContext();

export function AuthProvider(Props){
    const [auth, setAuth] = useState({});

    useEffect(() => {
     const admin = GetCookie('AdminToken');
        //validate token with api
        if(admin){
            setAuth({
                admin 
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {Props.children}
        </AuthContext.Provider>
    );

}