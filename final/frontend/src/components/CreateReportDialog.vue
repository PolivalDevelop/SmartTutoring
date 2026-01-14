<template>
  <div class="edit-dialog open" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="edit-overlay" tabindex="-1"></div>

    <div class="edit-panel" role="document">
      <button class="dialog-close" aria-label="Chiudi" @click="$emit('close')">&times;</button>
      <h2 id="editTitle">Segnala utente</h2>

      <form @submit.prevent="sendReport" autocomplete="off">
        
        <div class="form-group" style="grid-column: span 2;">
          <label for="reason">Motivo</label>
          <select id="reason" v-model="form.reason" required>
            <option disabled value="">Seleziona un motivo…</option>
            <option value="contenuti-inappropriati">Contenuti inappropriati</option>
            <option value="linguaggio-offensivo">Linguaggio offensivo</option>
            <option value="comportamento-scorretto">Comportamento scorretto</option>
            <option value="spam-pubblicita">Spam / Pubblicità</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div class="form-group" style="grid-column: span 2;">
          <label for="comment">Descrizione del problema</label>
          <textarea 
            id="comment"
            v-model="form.comment"
            rows="4"
            maxlength="500"
            placeholder="Descrivi brevemente il motivo della segnalazione…"
            required
          ></textarea>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" @click="$emit('close')">Annulla</button>
          <button type="submit" class="btn btn-primary">Invia segnalazione</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"

const emit = defineEmits(["close", "createReport"])
const props = defineProps({
  reportedEmail: { type: String, required: true },
  reporterEmail: { type: String, required: true }
})

const form = reactive({
  reason: "",
  comment: ""
})

function sendReport() {
  if (!form.reason) {
    alert("Seleziona un motivo per il report.")
    return
  }

  const report = {
    reported: props.reportedEmail,
    reporter: props.reporterEmail,
    reason: form.reason,
    comment: form.comment,
    status: "pending",
    createdAt: new Date()
  }

  emit("createReport", report)
  emit("close")
}
</script>

<style scoped>

.edit-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-dialog.open {
  display: flex;
}

.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(1px);
}

.edit-panel {
  position: relative;
  background: var(--card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 1.5rem 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  animation: fadeIn 0.2s ease;
}

.dialog-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--muted);
}

.dialog-close:hover {
  color: var(--accent);
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

textarea {
  resize: none;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  grid-column: span 2;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
