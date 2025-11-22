<template>
  <div class="publish-dialog open" role="dialog" aria-modal="true" aria-labelledby="publishTitle" @click.self="$emit('close')">
    <div class="publish-overlay" tabindex="-1"></div>

    <div class="publish-panel" role="document">
      <button class="dialog-close" aria-label="Chiudi finestra" @click="$emit('close')">&times;</button>
      <h2 id="publishTitle">Pubblica nuova lezione</h2>

      <form id="publishForm" autocomplete="off" @submit.prevent="submitLesson">
        <label for="lessonTeacher">Docente</label>
        <input type="text" id="lessonTeacher" v-model="lesson.teacher" readonly />

        <label for="lessonCourse">Corso</label>
        <select id="lessonCourse" v-model="lesson.course" required>
          <option value="">Seleziona un corso...</option>
          <option value="Analisi">Analisi</option>
          <option value="Programmazione in C">Programmazione in C</option>
          <option value="Inglese">Inglese</option>
        </select>

        <label for="lessonDate">Data</label>
        <input
          type="date"
          id="lessonDate"
          v-model="lesson.date"
          :min="today"
          :max="maxDate"
          required
        />

        <label for="lessonTimeStart">Ora inizio</label>
        <select id="lessonTimeStart" v-model="lesson.timeStart" required>
          <option value="">Seleziona...</option>
          <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
        </select>

        <label for="lessonDuration">Durata</label>
        <select id="lessonDuration" v-model="lesson.duration" required>
          <option value="30 minuti">30 minuti</option>
          <option value="45 minuti">45 minuti</option>
          <option value="1 ora">1 ora</option>
          <option value="1 ora e 15 minuti">1 ora e 15 minuti</option>
          <option value="1 ora e 30 minuti">1 ora e 30 minuti</option>
          <option value="1 ora e 45 minuti">1 ora e 45 minuti</option>
          <option value="2 ore">2 ore</option>
          <option value="2 ore e 15 minuti">2 ore e 15 minuti</option>
          <option value="2 ore e 30 minuti">2 ore e 30 minuti</option>
          <option value="2 ore e 45 minuti">2 ore e 45 minuti</option>
          <option value="3 ore">3 ore</option>
        </select>

        <label for="lessonPrice">Prezzo (€)</label>
        <input
          type="number"
          id="lessonPrice"
          v-model.number="lesson.price"
          min="1"
          step="1"
          required
        />

        <div class="dialog-actions">
          <button type="button" id="dlgCancelPub" class="btn btn-ghost" @click="$emit('close')">
            Annulla
          </button>
          <button type="submit" class="btn btn-primary">Pubblica</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useUser } from '@/composables/useUser.js'

const emit = defineEmits(['close', 'publish'])

const { currentUser } = useUser()
const now = new Date()
const today = now.toISOString().split('T')[0]
const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]

// Genera orari ogni 15 minuti
const timeOptions = computed(() => {
  const times = []
  for (let h = 7; h <= 22; h++) {
    for (let m of [0, 15, 30, 45]) {
      if (h === 22 && m > 0) break
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
})

const lesson = reactive({
  teacher: currentUser.value?.name || '',
  course: '',
  date: '',
  timeStart: '',
  duration: '1 ora',
  price: 15
})

function submitLesson() {
  if (!lesson.course || !lesson.date || !lesson.timeStart || !lesson.duration || !lesson.price) return

  const formattedDate = new Date(`${lesson.date}T${lesson.timeStart}`).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })

  const formattedTime = lesson.timeStart

  emit('publish', {
    teacher: lesson.teacher,
    subject: lesson.course,
    date: lesson.date,
    duration: lesson.duration,
    cost: lesson.price
  })

  emit('close')
}
</script>

<style scoped>
.publish-dialog.hidden { display: none; }
.publish-dialog {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.publish-overlay {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, black 40%, transparent);
  backdrop-filter: blur(2px);
}

.publish-panel {
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

.publish-dialog.open .publish-panel {
  transform: translateY(0);
}

.publish-panel label {
  display: block;
  margin-top: .6rem;
  font-weight: 500;
}

.publish-panel input,
.publish-panel select {
  width: 100%;
  margin-top: .25rem;
  padding: .5rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 20%, transparent);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
}

.publish-panel input:focus,
.publish-panel select:focus {
  outline: 2px solid var(--accent);
  border-color: var(--accent);
}

.publish-panel .dialog-actions {
  display: flex;
  gap: .6rem;
  justify-content: flex-end;
  margin-top: .9rem;
}

.publish-panel .dialog-close {
  position: absolute;
  top: .5rem;
  right: .5rem;
  font-size: 1.4rem;
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  border-radius: 8px;
}

.publish-panel .dialog-close:hover {
  color: var(--text);
}

@media (max-width: 520px) {
  .publish-panel { width: calc(100% - 1.4rem); padding: .9rem; }
  .publish-panel .dialog-actions { flex-direction: column-reverse; }
  .publish-panel .dialog-actions .btn { width: 100%; }
}
</style>
