document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('switch-tema');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(currentTheme);

    themeSwitch.checked = currentTheme === 'dark';

    themeSwitch.addEventListener('change', function() {
        const newTheme = themeSwitch.checked ? 'dark' : 'light';
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});