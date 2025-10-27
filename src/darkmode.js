(function() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const iconMoon = document.getElementById('iconMoon');
  const iconSun = document.getElementById('iconSun');
  const key = 'st-theme';

  // Legge la preferenza salvata o di sistema
  const saved = localStorage.getItem(key);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  // Mostra icona giusta
  function updateIcon(theme) {
    if (theme === 'dark') {
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    } else {
      iconMoon.classList.remove('hidden');
      iconSun.classList.add('hidden');
    }
  }
  updateIcon(theme);

  toggle.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem(key, newTheme);
    updateIcon(newTheme);
  });
})();