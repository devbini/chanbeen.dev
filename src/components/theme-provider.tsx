'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'site-theme';

let transitionReset: ReturnType<typeof setTimeout> | undefined;

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    clearTimeout(transitionReset);
    root.classList.add('theme-changing');
    // Register the shared transition before changing the palette.
    window.getComputedStyle(document.body).transitionProperty;
    root.classList.toggle('dark', theme === 'dark');
    transitionReset = setTimeout(() => root.classList.remove('theme-changing'), 400);
}

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, updateTheme] = useState<Theme>('light');

    useEffect(() => {
        updateTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        const syncTheme = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY && event.key !== null) return;
            const nextTheme = event.newValue === 'dark' ? 'dark' : 'light';
            applyTheme(nextTheme);
            updateTheme(nextTheme);
        };
        window.addEventListener('storage', syncTheme);
        return () => window.removeEventListener('storage', syncTheme);
    }, []);

    const setTheme = (nextTheme: Theme) => {
        applyTheme(nextTheme);
        updateTheme(nextTheme);
        try {
            localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
            // The current tab still switches when browser storage is unavailable.
        }
    };

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
