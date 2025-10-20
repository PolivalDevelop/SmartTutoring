(function() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const storageKey = 'st-theme';

  const saved = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', currentTheme);

  btn.textContent = currentTheme === 'dark' ? '🌞' : '🌙';

  btn.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem(storageKey, newTheme);
    btn.textContent = newTheme === 'dark' ? '🌞' : '🌙';
  });
})();
