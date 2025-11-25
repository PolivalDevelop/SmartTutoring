<template>
  <div class="app" role="application" aria-label="Piattaforma prenotazioni ripetizioni">
    <AppHeader @toggle-theme="toggleTheme" />

    <main class="access-container" role="main" aria-labelledby="registerTitle">
      <section class="access-card">
        <h2 id="registerTitle">Crea il tuo account</h2>
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label for="firstName">firstName *</label>
            <input v-model.trim="form.firstName" type="text" id="firstName" required />
          </div>

          <div class="form-group">
            <label for="lastName">lastName *</label>
            <input v-model.trim="form.lastName" type="text" id="lastName" required />
          </div>

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

          <div class="form-group">
            <label for="degreeType">Tipo di corso *</label>
            <select v-model="form.degreeType" id="degreeType" required>
              <option value="">Seleziona...</option>
              <option value="triennale">Triennale</option>
              <option value="magistrale">Magistrale</option>
              <option value="dottorato">Dottorato</option>
            </select>
          </div>

          <hr aria-hidden="true" />

          <div class="form-group">
            <label for="photo">Foto profilo (opzionale)</label>
            <input type="file" id="photo" accept=".jpg,.png" @change="onFileChange" />
          </div>

          <div class="form-group">
            <label for="birthDate">Data di nascita (opzionale)</label>
            <input v-model="form.birthDate" type="date" id="birthDate" />
          </div>

          <div class="form-group">
            <label for="averageGrade">Media universitaria (opzionale)</label>
            <input v-model.number="form.averageGrade" type="number" id="averageGrade" min="18" max="30" step="0.1" />
          </div>

          <div class="form-group">
            <label for="bio">Breve bio (opzionale)</label>
            <textarea
              v-model="form.bio"
              id="bio"
              rows="3"
              maxlength="200"
              placeholder="Scrivi una breve presentazione..."
            ></textarea>
          </div>

          <button type="submit" class="btn-primary-large">Iscriviti</button>
          <p class="secondary-text">
            Hai già un account?
            <RouterLink to="/login">Accedi</RouterLink>
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

import { login } from '@/composables/auth.js'
import { inject } from "vue";
import { getCurrentUser } from '../composables/auth'
const socket = inject("socket");

const { toggleTheme } = useDarkMode()
const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  degreeType: '',
  photo: null,
  birthDate: '',
  averageGrade: null,
  bio: ''
})

const showPassword = ref(false)
function togglePassword() {
  showPassword.value = !showPassword.value
}

const toast = reactive({ visible: false, message: '' })
let toastTimeout
function showToast(message) {
  toast.message = message
  toast.visible = true
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => (toast.visible = false), 3000)
}

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

function onFileChange(e) {
  form.photo = e.target.files[0]
}

function handleSubmit() {
  errors.email = false
  errors.password = false

  const emailValid = form.email.endsWith('@studio.unibo.it')
  const passwordValid = /^(?=.*[0-9]).{6,}$/.test(form.password)

  if (!emailValid) showFieldError('email') && showToast('❌ Usa la tua email istituzionale @studio.unibo.it')
  if (!passwordValid) showFieldError('password') && showToast('❌ La password deve avere almeno 6 caratteri e includere un numero')
  if (!emailValid || !passwordValid) return



  console.log("Submitting registration form:", form)
  socket.emit("user:register", form, (response) => {
    if (!response.success) {
      console.log(response.error)
      showToast("❌ " + response.error)
      return
    }

    // 🔵 Login automatico
    socket.emit("session:login", { email: form.email, password: form.password }, (res) => {
      if (!res.success) {
        showToast("⚠️ Registrato ma non loggato: " + res.error)
        return
      }

      // 🔥 Utente loggato correttamente
      login(res.data) // salva nel tuo store
      console.log("Utente registrato e loggato:", res.data)
      console.log(getCurrentUser())
      showToast("✅ Registrazione completata con successo!")

      setTimeout(() => router.push("/"), 500)
    })
  })
}
</script>
