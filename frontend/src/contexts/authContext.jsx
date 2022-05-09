import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const response = await fetch('/api/user');

            const data = await response.json();
            setUser(data);

            if (data.error) {
                if (location.pathname !== '/login' && location.pathname !== '/register') {
                    navigate('/login');
                };
            } else if (!data.error && (location.pathname === '/login' || location.pathname === '/register')) {
                navigate('/');
            } else if (!data && location.pathname === '/logout') {
                navigate('/login');
            };

        } catch (e) {
            console.log(e);
        };
    };

    useEffect(() => {
        getUser();
    }, [user?._id]);

    const login = async (user) => {
        try {
            const jsonResponse = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const response = await jsonResponse.json();
            setUser(response);
            return response;
        } catch (e) {
            console.log(e);
        }
    };

    const logout = async () => {
        try {
            const jsonResponse = await fetch('/api/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const response = await jsonResponse.json();
            setUser(null);
            return response;
        } catch (e) {
            console.log(e);
        };
    };

    const register = async (user) => {
        try {
            const jsonResponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const response = await jsonResponse.json();
            setUser(response);
            return response;
        } catch (e) {
            console.log(e);
        };
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
};