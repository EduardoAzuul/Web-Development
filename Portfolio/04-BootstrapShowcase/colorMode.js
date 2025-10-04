const setTheme = theme => {
    const current = getCurrentTheme();
    let newTheme;
    
    if (current === 'dark') {
        newTheme = 'light';
        document.documentElement.setAttribute('data-bs-theme', 'light');
    } else {
        newTheme = 'dark';
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    localStorage.setItem('theme', newTheme);
  }

const getCurrentTheme = () => {

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

document.addEventListener('DOMContentLoaded', () => {
    const theme = getCurrentTheme();
    document.documentElement.setAttribute('data-bs-theme', theme);
});