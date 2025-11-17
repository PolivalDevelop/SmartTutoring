// src/composables/useUser.js
import { ref, computed, watch } from 'vue'
import { isLoggedIn, login as authLogin, logout as authLogout } from './auth.js'

/* --------------------------------------
   UTENTI INIZIALI (persistenti)
-------------------------------------- */
const defaultUsers = [
  {
    id: 1,
    name: 'Marco Rossi',
    email: 'marco.rossi@studio.unibo.it',
    password: 'user123',
    degreeType: 'triennale',
    birthDate: '1999-05-20',
    avgGrade: 28.3,
    bio: 'Studente appassionato di matematica.',
    photo: null,
    rating: 4.5,
    reviewsCount: 12
  },
  {
    id: 2,
    name: 'Laura Bianchi',
    email: 'laura.bianchi@studio.unibo.it',
    password: 'user123',
    degreeType: 'magistrale',
    birthDate: '1998-09-11',
    avgGrade: 29.1,
    bio: 'Tutor esperta in programmazione.',
    photo: null,
    rating: 4.9,
    reviewsCount: 22
  }
]

/* --------------------------------------
   STATO REATTIVO
-------------------------------------- */
export const users = ref(JSON.parse(localStorage.getItem('users')) || defaultUsers)
export const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null)

/* --------------------------------------
   SINCRONIZZAZIONE CON LOCALSTORAGE
-------------------------------------- */
watch(users, (val) => {
  localStorage.setItem('users', JSON.stringify(val))
}, { deep: true })

watch(currentUser, (val) => {
  if (val) localStorage.setItem('user', JSON.stringify(val))
})

/* --------------------------------------
   REGISTRAZIONE
-------------------------------------- */
export function registerUser(userData) {
  // controllo email duplicata
  const existing = users.value.find(u => u.email === userData.email)
  if (existing) {
    throw new Error('Email già registrata')
  }

  const newUser = {
    id: Date.now(),
    name: `${userData.nome} ${userData.cognome}`,
    email: userData.email,
    password: userData.password, // salvata in chiaro per ora (solo sessione)
    degreeType: userData.tipo,
    birthDate: userData.nascita || '',
    avgGrade: userData.media || null,
    bio: userData.bio || '',
    photo: userData.foto ? URL.createObjectURL(userData.foto) : null,
    rating: 0,
    reviewsCount: 0
  }

  users.value.push(newUser)
  currentUser.value = newUser
  authLogin(newUser) // mantiene compatibilità totale

  return newUser
}

/* --------------------------------------
   LOGIN VERO (email + password)
-------------------------------------- */
export function findUserByEmail(email) {
  return users.value.find(u => u.email === email)
}

export function loginUser(email, password) {
  const user = users.value.find(
    u => u.email === email && u.password === password
  )
  if (!user) return null

  currentUser.value = user
  authLogin(user)

  return user
}

/* --------------------------------------
   LOGOUT
-------------------------------------- */
export function logoutUser() {
  currentUser.value = null
  authLogout()
}

/* --------------------------------------
   AGGIORNA PROFILO
-------------------------------------- */
export function updateUser(updatedFields) {
  if (!currentUser.value) return

  const updated = { ...currentUser.value, ...updatedFields }
  currentUser.value = updated

  const index = users.value.findIndex(u => u.id === updated.id)
  if (index !== -1) {
    users.value[index] = updated
  }
}

/* --------------------------------------
   RIMUOVI UTENTE (se servirà)
-------------------------------------- */
export function removeUser(id) {
  users.value = users.value.filter(u => u.id !== id)

  if (currentUser.value?.id === id) {
    logoutUser()
  }
}

/* --------------------------------------
   COMPOSABLE STANDARD
-------------------------------------- */
export function useUser() {
  return { currentUser, users }
}

/* --------------------------------------
   FILTRI (opzionali)
-------------------------------------- */
export const userById = (id) =>
  computed(() => users.value.find(u => u.id === id))

export const isEmailTaken = (email) =>
  computed(() => users.value.some(u => u.email === email))
