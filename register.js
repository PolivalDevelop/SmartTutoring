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

  const emailInput = form.email;
  const passwordInput = form.password;

  // Reset messaggi errore
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  emailError.textContent = '';
  passwordError.textContent = '';

  let valid = true;

  // === Controllo email istituzionale ===
  const email = emailInput.value.trim();
  if (!email.endsWith('@studio.unibo.it')) {
    emailError.textContent = 'Usa la tua email istituzionale @studio.unibo.it';
    valid = false;
  }

  // === Controllo password ===
  const password = passwordInput.value;
  const passwordRegex = /^(?=.*[0-9]).{6,}$/;
  if (!passwordRegex.test(password)) {
    passwordError.textContent = 'La password deve avere almeno 6 caratteri e includere un numero';
    valid = false;
  }

  // === Se non valido, non inviare ===
  if (!valid) return;

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
