// === Tema toggle ===
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
});

// === Mostra/Nascondi password ===
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// === Toast utility ===
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.getElementById('toastClose');
let toastTimeout;

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(hideToast, 3000);
}

function hideToast() {
  toast.classList.remove('show');
  setTimeout(() => toast.classList.add('hidden'), 300);
}

toastClose.addEventListener('click', hideToast);

// === Validazione form ===
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;

  const email = form.email.value.trim();
  const password = form.password.value;

  // Reset messaggi errore
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';

  let valid = true;

  // Controllo email istituzionale
  if (!email.endsWith('@studio.unibo.it')) {
    document.getElementById('emailError').textContent = 'Usa la tua email istituzionale @studio.unibo.it';
    valid = false;
  }

  // Controllo password
  const passwordRegex = /^(?=.*[0-9]).{6,}$/;
  if (!passwordRegex.test(password)) {
    document.getElementById('passwordError').textContent = 'La password deve avere almeno 6 caratteri e includere un numero';
    valid = false;
  }

  if (!form.checkValidity() || !valid) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Dati form inviati:', data);

  // Simula invio dati
  showToast('✅ Registrazione completata con successo!');

  // Reset + redirect dopo 3s
  setTimeout(() => {
    form.reset();
    window.location.href = 'index.html';
  }, 3000);
});
