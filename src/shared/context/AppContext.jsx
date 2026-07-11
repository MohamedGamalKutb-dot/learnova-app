import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('learnova_dark');
        return saved ? JSON.parse(saved) : false;
    });
    const [isArabic, setIsArabic] = useState(() => {
        const saved = localStorage.getItem('learnova_arabic');
        return saved ? JSON.parse(saved) : false;
    });

    // Sync dark class on <html> for Tailwind dark: variant
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    // Sync dir attribute on <html> for RTL
    useEffect(() => {
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    }, [isArabic]);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            localStorage.setItem('learnova_dark', JSON.stringify(!prev));
            return !prev;
        });
    }, []);

    const toggleLanguage = useCallback(() => {
        setIsArabic(prev => {
            localStorage.setItem('learnova_arabic', JSON.stringify(!prev));
            return !prev;
        });
    }, []);

    return (
        <AppContext.Provider value={{ isDark, isArabic, toggleTheme, toggleLanguage }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
