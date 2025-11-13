// src/composables/useUser.js
import { ref } from 'vue'
import { isLoggedIn } from './auth.js'

// stato reattivo condiviso
const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null)

// funzione per registrare un utente
export function registerUser(userData) {
  const newUser = {
    id: Date.now(),
    name: `${userData.nome} ${userData.cognome}`,
    email: userData.email,
    degreeType: userData.tipo,
    birthDate: userData.nascita || '',
    avgGrade: userData.media || null,
    bio: userData.bio || '',
    photo: userData.foto ? URL.createObjectURL(userData.foto) : null,
    rating: 0,
    reviewsCount: 0,
  }

  currentUser.value = newUser
  localStorage.setItem('user', JSON.stringify(newUser))

  isLoggedIn.value = true
  localStorage.setItem('loggedIn', 'true')

  return newUser
}

// getter per ottenere l’utente attuale
export function useUser() {
  return { currentUser }
}

// logout o reset
export function logoutUser() {
  currentUser.value = null
  localStorage.removeItem('user')
  isLoggedIn.value = false
  localStorage.removeItem('loggedIn')
}
