// src/composables/useLessons.js
import { ref, computed } from 'vue'
import { useUser } from './useUser.js'

const { currentUser } = useUser()

// Stato condiviso per tutte le lezioni
export const lessons = ref([
  { id: 1, title: 'Analisi', time: 'Mercoledì • 12:00', duration: '1h', price: 10, author: 'Marco Rossi', authorId: 1, bookedBy: '', bookedById: null },
  { id: 2, title: 'Programmazione in C', time: 'Giovedì • 15:00', duration: '1.5h', price: 15, author: 'Laura Bianchi', authorId: 2, bookedBy: '', bookedById: null },
  { id: 3, title: 'Inglese', time: 'Venerdì • 17:00', duration: '1h', price: 15, author: 'Luca Cantagallo', authorId: 3, bookedBy: 'Marco Rossi', bookedById: 1 },
  { id: 4, title: 'Inglese', time: 'Venerdì • 17:00', duration: '1h', price: 15, author: 'Luca Cantagallo', authorId: 3, bookedBy: '', bookedById: null },
  { id: 5, title: 'Analisi', time: 'Mercoledì • 12:00', duration: '1h', price: 10, author: 'Marco Rossi', authorId: 1, bookedBy: 'Luca Cantagallo', bookedById: 3 },
])

// Funzione per aggiungere una lezione
export function addLesson(lesson) {
  lessons.value.unshift({
    ...lesson,
    authorId: currentUser.value?.id,
    bookedBy: '', // di default non prenotata
    bookedById: null
  })
}

// Rimuove una lezione
export function removeLesson(id) {
  lessons.value = lessons.value.filter(lesson => lesson.id !== id)
}

// Prenota una lezione
export function bookLesson(id) {
  const lesson = lessons.value.find(l => l.id === id)
  if (lesson && !lesson.bookedById) {
    lesson.bookedBy = currentUser.value?.name || 'Anonimo'
    lesson.bookedById = currentUser.value?.id || null
  }
}

// Filtri utili
export const availableLessons = computed(() =>
  lessons.value.filter(l => l.bookedBy === '')
)

export const myAvailableLessons = computed(() =>
  lessons.value.filter(l => !l.bookedById && l.authorId === currentUser.value?.id)
)

export const myBookedLessons = computed(() =>
  lessons.value.filter(l => l.bookedById === currentUser.value?.id)
)

export const myOfferedLessons = computed(() =>
  lessons.value.filter(l => l.authorId === currentUser.value?.id)
)

