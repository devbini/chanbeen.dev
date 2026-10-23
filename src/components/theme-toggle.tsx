'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <button
            type="button"
            className="site-theme-toggle"
            aria-label="다크 모드"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            <span className="theme-sun" aria-hidden="true">
                <Sun size={18} /> Light
            </span>
            <span className="theme-moon" aria-hidden="true">
                <Moon size={18} /> Dark
            </span>
        </button>
    );
}
