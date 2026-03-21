import { createContext, useEffect, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState([
        {
            id : 1,
            name: 'Nora',
            username : 'nora',
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
        const foundUser = user.find((u) => (u.username === username || u.name === username) && u.password === password);
        if (foundUser) {
            setCurrentUser({
                id: foundUser.id,
                name: foundUser.name,
                username: foundUser.username,
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

    const addUser = (name, username, password) => {
        const maxId = user.length > 0 ? Math.max(...user.map(u => u.id)) : 0;
        const newUser = {
            id: maxId + 1,
            name,
            username,
            password,
        };
        setUser((prev) => [...prev, newUser]);
        return newUser;
    };

    const register = (name, username, password, password_confirmation) => {
        if (password !== password_confirmation) {
            return false;
        }
        if (user.some((u) => u.username === username)) {
            return false;
        }
        const newUser = addUser(name, username, password);
        setCurrentUser({
            id: newUser.id,
            name,
            username,
        });
        setIsLoggedIn(true);
        return true;
    };

    return (
        <UserContext.Provider value={{ user, setUser, currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn, login, logout, register, addUser }}>
            {children}
        </UserContext.Provider>
    );

}
