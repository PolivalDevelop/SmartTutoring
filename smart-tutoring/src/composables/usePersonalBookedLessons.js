// src/composables/usePersonalBookedLessons.js
import { ref } from 'vue'

// Stato condiviso per le lezioni
export const bookedLessons = ref([
  { id: 1, title: 'Analisi', time: 'Mercoledì • 15:00', duration: '1h', price: 10, author: 'Marco Rossi' },
])

// Funzione per aggiungere una lezione
export function addLesson(lesson) {
  bookedLessons.value.unshift(lesson)
}

export function removeLesson(id) {
  bookedLessons.value = bookedLessons.value.filter(lesson => lesson.id !== id)
}
