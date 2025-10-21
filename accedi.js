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
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  let valid = true;

  form.querySelectorAll('.error-tooltip').forEach(el => el.remove());
  form.querySelectorAll('input').forEach(el => el.classList.remove('error'));

  if (!email.endsWith('@studio.unibo.it')) {
    showFieldError(form.email, 'Usa la tua email istituzionale @studio.unibo.it');
    valid = false;
  }

  if (password.length < 6) {
    showFieldError(form.password, 'La password deve avere almeno 6 caratteri');
    valid = false;
  }

  if (!valid) return;

  showToast('✅ Accesso effettuato con successo!');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2500);
});
