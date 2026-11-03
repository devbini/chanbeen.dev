// Apply the saved theme before the first paint, including the old gallery preference.
export const themeInitScript = `(() => {
    let theme = 'light';
    try {
        const saved = localStorage.getItem('site-theme') || localStorage.getItem('photo-gallery-theme');
        if (saved === 'light' || saved === 'dark') theme = saved;
    } catch {}
    document.documentElement.classList.toggle('dark', theme === 'dark');
})();`;
