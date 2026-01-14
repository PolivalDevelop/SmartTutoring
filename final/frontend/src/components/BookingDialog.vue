<template>
  <div class="booking-dialog open" role="dialog" aria-modal="true">
    <div class="booking-overlay" @click="$emit('close')"></div>

    <div class="booking-panel" role="document">
      <button class="dialog-close" aria-label="Chiudi" @click="$emit('close')">&times;</button>
      <header class="dialog-header">
        <h2>Conferma prenotazione</h2>
        <p class="dialog-sub">Sei sicuro di voler prenotare questa lezione?</p>
      </header>
      <div class="dialog-body">
        <p><strong>Lezione:</strong> {{ lesson.subject }}</p>
        <p><strong>insegnante:</strong> {{ lesson.teacher }}</p>
        <p><strong>Costo:</strong> €{{ lesson.price }}</p>
        <p><strong>durata:</strong> {{ lesson.duration }}</p>
        <p><strong>data:</strong> {{ new Date(lesson.date).toLocaleDateString('it-IT') }}</p>
        <p class="muted">Il costo sarà addebitato dal saldo interno di Smart Tutoring.</p>
      </div>
      <footer class="dialog-footer">
        <button class="btn btn-ghost" @click="$emit('close')">Annulla</button>
        <button class="btn btn-primary" @click="$emit('confirm')">Conferma e paga</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({ lesson: Object })
</script>

<style scoped>
.booking-dialog.hidden { display: none; }
.booking-dialog {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.booking-overlay {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, black 40%, transparent);
  backdrop-filter: blur(2px);
}

.booking-panel {
  position: relative;
  background: var(--card);
  color: var(--text);
  border-radius: calc(var(--radius) - 4px);
  padding: 1.15rem;
  width: min(520px, calc(100% - 2rem));
  box-shadow: var(--shadow-md);
  z-index: 1101;
  transform: translateY(6px);
  transition: transform .18s ease, opacity .18s ease;
}

.booking-dialog.open .booking-panel { transform: translateY(0); }

.dialog-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
  padding: .25rem;
  border-radius: 8px;
}
.dialog-close:focus { outline: 2px solid var(--accent); }

.dialog-header { margin-bottom: .5rem; }
.dialog-sub { margin: .25rem 0 0; color: var(--muted); font-size: .95rem; }

.dialog-body p { margin: .45rem 0; font-size: .95rem; }
.dialog-body .muted { color: var(--muted); font-size: .9rem; margin-top: .5rem; }

.dialog-footer {
  display: flex;
  gap: .6rem;
  justify-content: flex-end;
  margin-top: .8rem;
}

.dialog-footer .btn:focus { outline: 3px solid color-mix(in srgb, var(--accent) 25%, transparent); outline-offset: 2px; }

@media (max-width: 520px) {
  .booking-panel { padding: .85rem; width: calc(100% - 1.6rem); }
  .dialog-footer { flex-direction: column-reverse; align-items: stretch; }
  .dialog-footer .btn { width: 100%; }
}
</style>
