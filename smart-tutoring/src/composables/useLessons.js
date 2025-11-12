// src/composables/useLessons.js
import { ref } from 'vue'

// Stato condiviso per le lezioni
export const lessons = ref([
  { id: 1, title: 'Analisi', time: 'Mercoledì • 12:00', duration: '1h', price: 10, author: 'Marco Rossi' },
  { id: 2, title: 'Programmazione in C', time: 'Giovedì • 15:00', duration: '1.5h', price: 15, author: 'Laura Bianchi' },
  { id: 3, title: 'Inglese', time: 'Venerdì • 17:00', duration: '1h', price: 12, author: 'Teodoro Verdi' }
])

// Funzione per aggiungere una lezione
export function addLesson(lesson) {
  lessons.value.unshift(lesson)
}
