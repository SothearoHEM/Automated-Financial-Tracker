import { createContext, useEffect, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState([
        {
            name: 'Nora',
            password: '12345678',
        }
    ]);

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const savedCurrentUser = localStorage.getItem('currentUser');
            return savedCurrentUser ? JSON.parse(savedCurrentUser) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
        return savedIsLoggedIn === 'true';
    });

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        else {            
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    const login = (username, password) => {
        const foundUser = user.find((u) => u.name === username && u.password === password);
        if (foundUser) {
            setCurrentUser({
                name: foundUser.name,
            });
            setIsLoggedIn(true);
            return true;
        }
        else {
            setIsLoggedIn(false);
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <UserContext.Provider value={{ user, setUser, currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );

}
