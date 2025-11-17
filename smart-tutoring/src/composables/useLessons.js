// src/composables/useLessons.js
import { ref, computed } from 'vue'
import { useUser } from './useUser.js'

const { currentUser } = useUser()

// Stato condiviso per tutte le lezioni
export const lessons = ref([
  { id: 1, title: 'Analisi', time: 'Mercoledì • 12:00', duration: '1h', price: 10, author: 'Marco Rossi', authorId: 1, bookedBy: '' },
  { id: 2, title: 'Programmazione in C', time: 'Giovedì • 15:00', duration: '1.5h', price: 15, author: 'Laura Bianchi', authorId: 2, bookedBy: '' },
  { id: 3, title: 'Inglese', time: 'Venerdì • 17:00', duration: '1h', price: 15, author: 'Luca Cantagallo', authorId: 3, bookedBy: 'Marco Rossi' },
  { id: 4, title: 'Inglese', time: 'Venerdì • 17:00', duration: '1h', price: 15, author: 'Luca Cantagallo', authorId: 3, bookedBy: '' },
  { id:56, title: 'Analisi', time: 'Mercoledì • 12:00', duration: '1h', price: 10, author: 'Marco Rossi', authorId: 1, bookedBy: 'Luca Cantagallo' },

])

// Funzione per aggiungere una lezione
export function addLesson(lesson) {
  lessons.value.unshift({
    ...lesson,
    bookedBy: '' // di default non prenotata
  })
}

// Rimuove una lezione
export function removeLesson(id) {
  lessons.value = lessons.value.filter(lesson => lesson.id !== id)
}

// Prenota una lezione
export function bookLesson(id) {
  const lesson = lessons.value.find(l => l.id === id)
  if (lesson && !lesson.bookedBy) {
    lesson.bookedBy = currentUser.value?.name || 'Anonimo'
  }
}

// Filtri utili
export const availableLessons = computed(() =>
  lessons.value.filter(l => l.bookedBy === '')
)

export const myAvailableLessons = computed(() =>
  lessons.value.filter(l => l.bookedBy === '' && l.author === currentUser.value?.name)
)

export const myBookedLessons = computed(() =>
  lessons.value.filter(l => l.bookedBy === currentUser.value?.name)
)

export const myOfferedLessons = computed(() =>
  lessons.value.filter(l => l.author === currentUser.value?.name)
)
