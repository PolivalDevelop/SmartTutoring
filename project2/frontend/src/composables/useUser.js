// src/composables/useUser.js
import { ref } from 'vue'
import { isLoggedIn } from './auth.js'

// stato reattivo condiviso
const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null)


import axios from 'axios'

export async function registerUser(userData) {
  try {
    const formData = new FormData()
    formData.append('name', `${userData.nome} ${userData.cognome}`)
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    formData.append('tipo', userData.tipo)
    formData.append('nascita', userData.nascita)
    formData.append('media', userData.media)
    formData.append('bio', userData.bio)

    if (userData.foto) {
      formData.append('foto', userData.foto)
    }

    const registerResponse = await axios.post(
      `http://${process.env.VUE_APP_BACKEND_IP}:4000/user/register`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )

    console.log("Registrazione OK:", registerResponse.data)

    const loginResponse = await axios.post(
      `http://${process.env.VUE_APP_BACKEND_IP}:4000/user/login`,
      {
        username: userData.email,
        password: userData.password
      },
      { withCredentials: true }
    )

    console.log("Login OK:", loginResponse.data)

    const newUser = {
      id: loginResponse.data.id || Date.now(),
      username: `${userData.nome} ${userData.cognome}`,
      email: userData.email,
      password: userData.password,
      degreeType: userData.tipo,
      birthDate: userData.nascita || '',
      avgGrade: userData.media || null,
      bio: userData.bio || '',
      image: userData.foto ? URL.createObjectURL(userData.foto) : null,
    }

    currentUser.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('loggedIn', 'true')
    localStorage.setItem('accessToken', loginResponse.data.accessToken)

    isLoggedIn.value = true

    return newUser

  } catch (error) {
    console.error("Errore registrazione/login:", error)
    throw error.response?.data || error
  }
}


// getter per ottenere l’utente attuale
export function useUser() {
  return { currentUser }
}

export async function logoutUser() {
  try {
    // 1️⃣ Prendo il token se esiste
    const token = localStorage.getItem('accessToken')

    // 2️⃣ Chiamo il backend per invalidare la sessione
    await axios.post(
      `http://${process.env.VUE_APP_BACKEND_IP}:4000/user/logout`,
      {},
      {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    )

    console.log("Logout lato backend effettuato.")

  } catch (error) {
    console.error("Errore logout backend:", error)
  }

  currentUser.value = null
  localStorage.removeItem('user')
  isLoggedIn.value = false
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('accessToken')
  console.log("Logout locale completato.")
}

export function updateUser(updatedData) {
  currentUser.value = updatedData
  localStorage.setItem('user', JSON.stringify(updatedData))
}

