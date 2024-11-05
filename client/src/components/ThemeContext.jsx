import React, { useState, createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.body.classList.add(storedTheme);
        }
    }, []);

    const setLightTheme = () => {
        setTheme('light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        localStorage.setItem('theme', 'light');
    };

    const setDarkTheme = () => {
        console.log('dark');
        setTheme('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, setDarkTheme, setLightTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}