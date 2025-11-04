
// === Mostra/Nascondi password ===
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eye = togglePassword.querySelector('.eye');
const eyeOff = togglePassword.querySelector('.eye-off');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    eye.classList.toggle('hidden');
    eyeOff.classList.toggle('hidden');
});


// === Tooltip + Shake ===
function showFieldError(inputEl, message) {
  const existing = inputEl.parentElement.querySelector('.error-tooltip');
  if (existing) existing.remove();

  const tooltip = document.createElement('div');
  tooltip.className = 'error-tooltip';
  tooltip.textContent = message;

  inputEl.classList.add('error', 'shake');
  inputEl.parentElement.appendChild(tooltip);

  inputEl.addEventListener('animationend', () => inputEl.classList.remove('shake'), { once: true });

  inputEl.addEventListener('input', () => {
    tooltip.remove();
    inputEl.classList.remove('error');
  }, { once: true });

  setTimeout(() => tooltip.remove(), 3000);
}



    // === Validazione form ===
    document.getElementById('accessForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value.trim();
      const password = form.password.value;
      let valid = true;

      // Reset errori precedenti
      form.querySelectorAll('.error-tooltip').forEach(el => el.remove());
      form.querySelectorAll('input').forEach(el => el.classList.remove('error'));

      // Controllo email istituzionale
      if (!email.endsWith('@studio.unibo.it')) {
        showFieldError(form.email, 'Usa la tua email istituzionale @studio.unibo.it');
        valid = false;
      }

      // Controllo password
      const passwordRegex = /^(?=.*[0-9]).{6,}$/;
      if (!passwordRegex.test(password)) {
        showFieldError(form.password, 'La password deve avere almeno 6 caratteri e includere un numero');
        valid = false;
      }

      if (!valid) return;

      // Simula invio dati
      showToast('✅ Registrazione completata con successo!');
      setTimeout(() => {
        form.reset();
        window.location.href = 'indexlogged.html';
      }, 3000);
    });