<template>
  <div class="publish-dialog open" role="dialog" aria-modal="true" aria-labelledby="publishTitle" @click.self="$emit('close')">
    <div class="publish-overlay" tabindex="-1"></div>

    <div class="publish-panel" role="document">
      <button class="dialog-close" aria-label="Chiudi finestra" @click="$emit('close')">&times;</button>
      <h2 id="publishTitle">
        {{ lesson ? 'Modifica lezione' : 'Pubblica nuova lezione' }}
      </h2>

      <form id="publishForm" autocomplete="off" @submit.prevent="submitLesson">

        <label for="lessonCourse">Corso</label>
        <select id="lessonCourse" v-model="lessonUpdate.course" required>
          <option value="">Seleziona un corso...</option>
          <option 
            v-for="matter in matters" 
            :key="matter" 
            :value="matter"
          >
            {{ matter }}
          </option>
        </select>

        <label>Data</label>
        <div class="custom-date-wrapper" @click="openCalendar">
          <div class="fake-input" :class="{ 'has-value': lessonUpdate.date }">
            {{ formattedDateLabel }}
          </div>
          
          <input
            ref="dateInputRef"
            type="date"
            id="lessonDate"
            v-model="lessonUpdate.date"
            :min="today"
            :max="maxDate"
            required
            class="ghost-date-input"
            @click.stop
          />
          
          <span v-if="!lessonUpdate.date" class="calendar-icon">📅</span>
        </div>

        <label for="lessontime">Ora inizio</label>
        <select id="lessontime" v-model="lessonUpdate.time" required>
          <option value="">Seleziona...</option>
          <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
        </select>

        <label for="lessonDuration">Durata</label>
        <select id="lessonDuration" v-model="lessonUpdate.duration" required>
          <option value=30>30 minuti</option>
          <option value=45>45 minuti</option>
          <option value=60>60 minuti</option>
          <option value=90>90 minuti</option>
          <option value=120>120 minuti</option>
          <option value=180>180 minuti</option>
        </select>

        <label for="lessonPrice">Prezzo (€)</label>
        <input
          type="number"
          id="lessonPrice"
          v-model.number="lessonUpdate.price"
          min="1"
          step="1"
          required
        />

        <div class="dialog-actions">
          <button type="button" id="dlgCancelPub" class="btn btn-ghost" @click="$emit('close')">
            Annulla
          </button>
          <button type="submit" class="btn btn-primary">
            {{ lesson ? 'Salva modifiche' : 'Pubblica' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { getCurrentUser, matters } from '../composables/auth'

const props = defineProps({ lesson: Object })
const emit = defineEmits(['close', 'modify']) 
const dateInputRef = ref(null)

const now = new Date()
const today = now.toISOString().split('T')[0]
const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0]

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

const lessonUpdate = reactive({
  teacher: getCurrentUser().value?.email,
  course: '',
  date: '',
  time: '',
  duration: 60,
  price: 15
})

if (props.lesson) {
  Object.assign(lessonUpdate, {
    teacher: props.lesson.teacher,
    course: props.lesson.subject,
    date: props.lesson.date?.split('T')[0] ?? '',
    time: props.lesson.time,
    duration: props.lesson.duration,
    price: props.lesson.price
  })
}

const formattedDateLabel = computed(() => {
  if (!lessonUpdate.date) return 'Seleziona data...';
  try {
    const [year, month, day] = lessonUpdate.date.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return lessonUpdate.date;
  }
})

function openCalendar() {
  if (dateInputRef.value) {
    if (typeof dateInputRef.value.showPicker === 'function') {
      dateInputRef.value.showPicker();
    } else {
      dateInputRef.value.focus();
    }
  }
}

function submitLesson() {
  if (!lessonUpdate.course || !lessonUpdate.date || !lessonUpdate.time || !lessonUpdate.duration || !lessonUpdate.price) return

  const payload = {
    _id: props.lesson?._id || undefined,
    teacher: lessonUpdate.teacher,
    subject: lessonUpdate.course,
    time: lessonUpdate.time,
    date: lessonUpdate.date,
    duration: lessonUpdate.duration,
    price: lessonUpdate.price
  }

  emit('modify', payload)
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

.publish-panel input:not(.ghost-date-input),
.publish-panel select {
  width: 100%;
  margin-top: .25rem;
  padding: .5rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 20%, transparent);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  box-sizing: border-box;
}

.publish-panel input:focus,
.publish-panel select:focus {
  outline: 2px solid var(--accent);
  border-color: var(--accent);
}

.custom-date-wrapper {
  position: relative;
  width: 100%;
  margin-top: .25rem;
  cursor: pointer;
}

.fake-input {
  width: 100%;
  padding: .5rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 20%, transparent);
  background: var(--bg);
  color: var(--muted, #888); 
  font-family: inherit;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: 38px;
}

.fake-input.has-value {
  color: var(--text);
}

.ghost-date-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  pointer-events: none;
}

.calendar-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
  opacity: 0.6;
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