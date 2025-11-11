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
        <p><strong>Lezione:</strong> {{ lesson.title }}</p>
        <p><strong>Autore:</strong> {{ lesson.author }}</p>
        <p><strong>Costo:</strong> €{{ lesson.price }}</p>
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
