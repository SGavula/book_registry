import {createContext, useContext, useState} from 'react';
// import {UserDocument} from '@shared';

export const UserContextImpl = createContext(null);

export function setUser () {
    return useContext(UserContextImpl);
};

export const UserProvider = ({children, initialUser}) => {
    const [user, setUser] = useState(initialUser);

    return <UserContextImpl.Provider value={{user, setUser}}>{children}</UserContextImpl.Provider>
}