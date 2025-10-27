const reportForm = document.getElementById('reportForm');
reportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Segnalazione inviata con successo.');
  reportForm.reset();
  setTimeout(() => window.location.href = 'profilo.html', 1500);
});
