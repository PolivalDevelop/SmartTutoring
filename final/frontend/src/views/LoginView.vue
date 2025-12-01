<template>
  <div class="app" role="application" aria-label="Piattaforma prenotazioni ripetizioni">
    <AppHeader @toggle-theme="toggleTheme" />

    <main class="access-container" role="main" aria-labelledby="loginTitle">
      <section class="access-card">
        <h2 id="loginTitle">Accedi al tuo account</h2>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label for="email">Email istituzionale *</label>
            <input
              v-model.trim="form.email"
              type="email"
              id="email"
              placeholder="nome.cognome@studio.unibo.it"
              required
              :class="{ error: errors.email }"
            />
          </div>

          <div class="form-group password-group">
            <label for="password">Password *</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                id="password"
                minlength="6"
                required
                :class="{ error: errors.password }"
              />
              <button type="button" class="password-toggle" @click="togglePassword" aria-label="Mostra password">
                <svg v-if="!showPassword" class="icon eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else class="icon eye-off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.1 10.1 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.06"/>
                  <path d="M1 1l22 22"/>
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-primary-large">Accedi</button>

          <p class="secondary-text">
            Non hai ancora un account?
            <RouterLink to="/register">Iscriviti</RouterLink>
          </p>
        </form>
      </section>
    </main>

    <ToastNotification v-if="toast.visible" :message="toast.message" @close="toast.visible = false" />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import useDarkMode from '@/composables/useDarkMode.js'
import '@/assets/styles/access-page.css'

import { login, getCurrentUser, isAdmin } from '@/composables/auth.js'
import { inject } from "vue";
const socket = inject("socket");

const { toggleTheme } = useDarkMode()
const router = useRouter()

// Stato form
const form = reactive({
  email: '',
  password: ''
})

// Toggle password
const showPassword = ref(false)
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Toast
const toast = reactive({ visible: false, message: '' })
let toastTimeout
function showToast(message) {
  toast.message = message
  toast.visible = true
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => (toast.visible = false), 3000)
}

// Errori campi
const errors = reactive({ email: false, password: false })

function showFieldError(field) {
  errors[field] = true
  nextTick(() => {
    const inputEl = document.getElementById(field)
    if (!inputEl) return
    inputEl.classList.add('shake')
    inputEl.addEventListener('animationend', () => inputEl.classList.remove('shake'), { once: true })
    inputEl.addEventListener('input', () => (errors[field] = false), { once: true })
  })
}

// Submit
function handleSubmit() {
  errors.email = false
  errors.password = false

  const emailValid = form.email.endsWith('@studio.unibo.it')
  const passwordValid = /^(?=.*[0-9]).{6,}$/.test(form.password)

  if (!emailValid) {
    showFieldError('email')
    showToast('❌ Usa la tua email istituzionale @studio.unibo.it')
  }

  if (!passwordValid) {
    showFieldError('password')
    showToast('❌ La password deve avere almeno 6 caratteri e includere un numero')
  }

  if (!emailValid || !passwordValid) return

  socket.emit("session:login", { email: form.email, password: form.password }, (res) => {
      if (!res.success) {
        showToast("credenziali non valide: " + res.error)
        return
      }

      login(res.data) // salva nel tuo store
      socket.emit("admin:check", form.email, (adminRes) => {
        if (adminRes.success) {
          console.log("Utente è admin:", adminRes.data)
          isAdmin.value = true
          console.log("Stato admin aggiornato a: ", getCurrentUser().value)
          console.log("isAdmin vale ora: ", isAdmin.value)
        } else {
          console.error("Errore nel controllo admin:", adminRes.error)
        }
      })
      
      showToast("✅ Registrazione completata con successo!")

      setTimeout(() => router.push("/"), 500)
    })
}
</script>
