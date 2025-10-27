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