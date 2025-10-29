(function () {
  const dialog = document.getElementById('publishDialog');
  if (!dialog) return;

  const overlay = dialog.querySelector('.publish-overlay');
  const btnClose = dialog.querySelector('.dialog-close');
  const btnCancel = document.getElementById('dlgCancelPub');
  const form = document.getElementById('publishForm');
  const fab = document.getElementById('fabPublish');
  const lessonsList = document.getElementById('lessonsList');
  const teacherInput = document.getElementById('lessonTeacher');

  let opener = null;

  function openDialog(button) {
    opener = button;
    dialog.classList.remove('hidden');
    dialog.classList.add('open');
    dialog.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    form.querySelector('#lessonCourse').focus();
  }

  function closeDialog() {
    dialog.classList.add('hidden');
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (opener && typeof opener.focus === 'function') opener.focus();
  }

  fab.addEventListener('click', () => openDialog(fab));
  overlay.addEventListener('click', closeDialog);
  btnClose.addEventListener('click', closeDialog);
  btnCancel.addEventListener('click', e => { e.preventDefault(); closeDialog(); });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const teacher = teacherInput.value.trim();
    const course = document.getElementById('lessonCourse').value.trim();
    const date = document.getElementById('lessonDate').value;
    const timeStart = document.getElementById('lessonTimeStart').value;
    const timeEnd = document.getElementById('lessonTimeEnd').value;
    const price = document.getElementById('lessonPrice').value;

    if (!course || !date || !timeStart || !timeEnd || !price) return;

    const dateObjStart = new Date(date + 'T' + timeStart);
    const dateObjEnd = new Date(date + 'T' + timeEnd);
    const formattedDate = dateObjStart.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
    const formattedTimeStart = dateObjStart.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const formattedTimeEnd = dateObjEnd.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    const article = document.createElement('article');
    article.className = 'lesson-card';
    article.innerHTML = `
      <div class="lesson-content">
        <div class="lesson-header">
          <h3 class="lesson-title">${course}</h3>
          <div class="lesson-info">
            <span class="time">${formattedDate} • ${formattedTimeStart} - ${formattedTimeEnd} • €${price}</span>
          </div>
        </div>
        <div class="lesson-footer">
          <div class="lesson-author">${teacher}</div>
          <div class="card-actions">
            <a href="profilo.html" class="small btn-ghost" aria-label="Vedi profilo">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>
            <button class="small btn-primary">Prenota</button>
          </div>
        </div>
      </div>
    `;

    lessonsList.prepend(article);

    if (typeof showToast === 'function') {
      showToast('✅ Lezione pubblicata con successo!');
    }

    form.reset();
    teacherInput.value = "Marco Rossi";
    closeDialog();
  });
})();
