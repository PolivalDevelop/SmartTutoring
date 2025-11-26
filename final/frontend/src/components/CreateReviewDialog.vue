<template>
  <div class="edit-dialog open" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="edit-overlay" tabindex="-1"></div>

    <div class="edit-panel" role="document">
      <button class="dialog-close" aria-label="Chiudi" @click="$emit('close')">&times;</button>
      <h2 id="editTitle">Lascia una recensione</h2>

      <form @submit.prevent="saveReview" autocomplete="off">
        
        <!-- ⭐ RATING -->
        <div class="form-group rating-group" style="grid-column: span 2;">
          <label>Valutazione</label>
          <div class="stars">
            <span 
              v-for="n in 5" 
              :key="n" 
              class="star" 
              :class="{ active: n <= form.rating }"
              @click="form.rating = n"
            >
              ★
            </span>
          </div>
        </div>

        <!-- COMMENTO -->
        <div class="form-group" style="grid-column: span 2;">
          <label for="comment">Commento</label>
          <textarea 
            id="comment" 
            v-model="form.comment" 
            rows="4" 
            maxlength="300"
            placeholder="Scrivi un commento (opzionale)..."
          ></textarea>
        </div>

        <!-- Bottoni -->
        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" @click="$emit('close')">Annulla</button>
          <button type="submit" class="btn btn-primary">Invia recensione</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(["close", "createReview"])
const props = defineProps({
  teacherEmail: String,   // email del docente
  studentEmail: String    // email dello studente
})

const form = reactive({
  rating: 0,
  comment: ""
})

function saveReview() {
  if (form.rating < 1 || form.rating > 5) {
    alert("Per favore seleziona una valutazione da 1 a 5 stelle.")
    return
  }

  const review = {
    teacher: props.teacherEmail,
    student: props.studentEmail,
    rating: form.rating,
    comment: form.comment
  }

  emit("createReview", review)
  emit("close")
}
</script>

<style scoped>
/* Usa il tuo CSS esistente e aggiungo solo la parte della valutazione */

/* Stelle rating */
.stars {
  display: flex;
  gap: 0.3rem;
  cursor: pointer;
  font-size: 1.8rem;
  user-select: none;
}

.star {
  color: #ccc;
  transition: color 0.2s;
}

.star.active {
  color: #f4b400; /* giallo stella */
}

.star:hover {
  color: #f4b400;
}

/* Mantengo tutto il tuo stile originale */
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
