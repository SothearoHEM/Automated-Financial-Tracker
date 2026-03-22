import { createContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
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
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // On mount: if token exists, validate it by fetching current user
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('auth_token');
            if (token && currentUser) {
                try {
                    const response = await authAPI.getCurrentUser();
                    setCurrentUser(response.data);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('isLoggedIn');
                    setCurrentUser(null);
                    setIsLoggedIn(false);
                }
            }
            setLoading(false);
        };

        validateToken();
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            setIsLoggedIn(false);
        }
    }, [currentUser]);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            localStorage.setItem('auth_token', response.data.token);
            // Fetch current user details
            const userResponse = await authAPI.getCurrentUser();
            setCurrentUser(userResponse.data);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const logout = async () => {
        setLogoutLoading(true);
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            setCurrentUser(null);
            setIsLoggedIn(false);
            setLogoutLoading(false);
        }
    };

    const register = async (name, username, password, password_confirmation) => {
        try {
            const response = await authAPI.register(name, username, password, password_confirmation);
            localStorage.setItem('auth_token', response.data.token);
            setCurrentUser(response.data.user);
            setIsLoggedIn(true);
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            let message = 'Registration failed';

            // Laravel validation errors format: { "field": ["message1", "message2"] }
            if (error.response?.data?.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                message = errors.join('. ');
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.message) {
                message = error.message;
            }

            return { success: false, message };
        }
    };

    return (
        <UserContext.Provider value={{
            currentUser,
            setCurrentUser,
            isLoggedIn,
            setIsLoggedIn,
            login,
            logout,
            register,
            loading,
            logoutLoading
        }}>
            {children}
        </UserContext.Provider>
    );

}
