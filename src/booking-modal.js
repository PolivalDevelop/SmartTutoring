// booking-modal.js
// Gestisce il dialog di conferma prenotazione

(function () {
  const dialog = document.getElementById('bookingDialog');
  if (!dialog) return;

  const overlay = dialog.querySelector('.booking-overlay');
  const btnCancel = document.getElementById('dlgCancel');
  const btnConfirm = document.getElementById('dlgConfirm');
  const btnClose = dialog.querySelector('.dialog-close');

  const titleEl = document.getElementById('dlgLessonTitle');
  const authorEl = document.getElementById('dlgLessonAuthor');
  const priceEl = document.getElementById('dlgLessonPrice');

  const lessonsList = document.getElementById('lessonsList');

  let openerButton = null; // bottone che ha aperto il dialog (per ritorno focus)
  let targetLessonEl = null; // article element che stiamo prenotando

  // utility: trova primo e ultimo focusable dentro il panel
  function getFocusable(container) {
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
  }

  function openDialogFor(button, lessonEl) {
    openerButton = button;
    targetLessonEl = lessonEl;

    // Leggi dati dalla card
    const title = lessonEl.querySelector('.lesson-title')?.textContent?.trim() || 'Lezione';
    const author = lessonEl.querySelector('.lesson-author')?.textContent?.trim() || 'Autore';
    const priceText = lessonEl.querySelector('.price')?.textContent?.trim() || '€0';

    titleEl.textContent = title;
    authorEl.textContent = author;
    priceEl.textContent = priceText;

    dialog.classList.remove('hidden');
    dialog.classList.add('open');
    dialog.setAttribute('aria-hidden', 'false');

    // disabilita scroll sul body
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // focus sul pulsante conferma
    btnConfirm.focus();

    // installa event listeners temporanei
    document.addEventListener('keydown', handleKeyDown);
    trapFocus();
  }

  function closeDialog() {
    dialog.classList.add('hidden');
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleKeyDown);

    // ritorna focus al bottone che ha aperto
    if (openerButton && typeof openerButton.focus === 'function') {
      openerButton.focus();
    }

    // pulizia
    openerButton = null;
    targetLessonEl = null;
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog();
    } else if (e.key === 'Tab') {
      // focus trap
      trapFocus(e);
    }
  }

  function trapFocus(e) {
    const panel = dialog.querySelector('.booking-panel');
    const focusables = getFocusable(panel);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (!e) return; // chiamato solo per inizializzare

    if (e.shiftKey && document.activeElement === first && e.key === 'Tab') {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last && e.key === 'Tab') {
      e.preventDefault();
      first.focus();
    }
  }

  // click sull'overlay o sul close
  overlay.addEventListener('click', closeDialog);
  btnClose.addEventListener('click', closeDialog);
  btnCancel.addEventListener('click', (e) => { e.preventDefault(); closeDialog(); });

  // Confirm: rimuove la lezione e mostra notifica
  btnConfirm.addEventListener('click', () => {
    if (!targetLessonEl) {
      closeDialog();
      return;
    }

    // Simula addebito / rimozione
    targetLessonEl.classList.add('removing');
    // animazione CSS (opzionale) -> poi rimuovere
    setTimeout(() => {
      // rimuove dal DOM
      if (targetLessonEl.parentElement) targetLessonEl.parentElement.removeChild(targetLessonEl);

      // Aggiorna aria-live (la rimozione dell'elemento con aria-live dovrebbe essere sufficiente
      // ma possiamo anche annunciare via toast o aria-polite)
      if (typeof showToast === 'function') {
        showToast('✅ Lezione prenotata con successo! Il costo è stato addebitato dal tuo saldo Smart Tutoring.');
    } else {
    console.log('Prenotazione confermata — il costo è stato addebitato.');
    }

    closeDialog();
  }, 180); // lieve delay per percepire animazione

    // In un'app reale qui faresti una chiamata fetch POST /bookings e poi aggiorneresti via socket.io
  });

  // Delegation: ascolta tutti i bottoni "Prenota" dentro .card-actions
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button');
    if (!b) return;

    // considera solo i bottoni con testo "Prenota" o classe .btn-primary dentro le card
    const inCard = b.closest && b.closest('.lesson-card');
    if (!inCard) return;

    // se è proprio il bottone prenota (classe btn-primary e testo contenente "Prenota")
    const isPrimary = b.classList.contains('btn-primary') || b.classList.contains('small');
    const text = (b.textContent || '').trim().toLowerCase();
    if (text.includes('prenota') || b.classList.contains('btn-primary')) {
      e.preventDefault();
      openDialogFor(b, inCard);
    }
  });

})();
