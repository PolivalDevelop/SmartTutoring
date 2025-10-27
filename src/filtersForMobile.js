document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('filtersToggle');
  const sidebar = document.querySelector('.sidebar');

  // Mostra/chiudi sidebar solo su mobile
  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.textContent = isOpen ? 'Chiudi filtri' : 'Mostra filtri';
  });

  // Chiude sidebar se si ridimensiona a desktop
  const handleResize = () => {
    if (window.innerWidth >= 880) {
      sidebar.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.textContent = 'Mostra filtri';
    }
  };
  window.addEventListener('resize', handleResize);
});