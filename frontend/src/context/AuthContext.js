import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    // Check local storage for an existing user/token on load
    const [user, setUser] = useState(() => {
        try {
            const localUser = localStorage.getItem('user');
            return localUser ? JSON.parse(localUser) : null;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            localStorage.removeItem('user'); // Clear invalid data
            return null;
        }
    });

    // Function to handle login (saves user data to state and local storage is handled by authService)
    const login = async (userData) => {
        const data = await authService.login(userData);
        setUser(data);
    };

    // Function to handle registration
    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data);
    };
    
    // Function to handle logout
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Provide the user state and functions to the rest of the application
    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook to use the Auth Context easily
export const useAuth = () => {
    return useContext(AuthContext);
};