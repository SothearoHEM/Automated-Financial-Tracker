import { createContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';
import { clearAuthSession, getCookieValue, getSessionItem, setSessionCookie, setSessionItem, removeSessionItem } from '../utils/clientStorage';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const savedCurrentUser = getSessionItem('currentUser');
            return savedCurrentUser ? JSON.parse(savedCurrentUser) : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const savedIsLoggedIn = getSessionItem('isLoggedIn');
        return savedIsLoggedIn === 'true';
    });
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // On mount: if token exists, validate it by fetching current user
    useEffect(() => {
        const validateToken = async () => {
            const token = getCookieValue('auth_token');
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser();
                    setCurrentUser(response.data);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    clearAuthSession();
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
            setSessionItem('currentUser', JSON.stringify(currentUser));
            setSessionItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
        } else {
            removeSessionItem('currentUser');
            removeSessionItem('isLoggedIn');
            setIsLoggedIn(false);
        }
    }, [currentUser]);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            setSessionCookie('auth_token', response.data.token);
            // Fetch current user details
            const userResponse = await authAPI.getCurrentUser();
            setCurrentUser(userResponse.data);
            return { success: true, message: response.data.message };
        } catch (error) {
            clearAuthSession();
            setCurrentUser(null);
            setIsLoggedIn(false);
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
            clearAuthSession();
            setCurrentUser(null);
            setIsLoggedIn(false);
            setLogoutLoading(false);
        }
    };

    const register = async (name, username, password, password_confirmation) => {
        try {
            const response = await authAPI.register(name, username, password, password_confirmation);
            setSessionCookie('auth_token', response.data.token);
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
