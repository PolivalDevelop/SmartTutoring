<template>
  <div class="app" role="application" aria-label="Piattaforma prenotazioni ripetizioni">
    <AppHeader @toggle-theme="toggleTheme" />

    <main class="access-container" role="main" aria-labelledby="registerTitle">
      <section class="access-card">
        <h2 id="registerTitle">Crea il tuo account</h2>
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-group centered-group">
            <div class="profile-pic-wrapper">
              <img
                :src="photoPreview || defaultPhoto"
                alt="Anteprima profilo"
                class="profile-pic"
              />
              <label for="photo" class="edit-icon" title="Carica immagine">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </label>
              <input type="file" id="photo" accept="image/*" @change="onFileChange" hidden />
            </div>
            <span class="secondary-text small-text">Foto profilo (opzionale)</span>
          </div>
          <div class="form-group">
            <label for="firstName">Nome *</label>
            <input v-model.trim="form.firstName" type="text" id="firstName" required />
          </div>

          <div class="form-group">
            <label for="lastName">Cognome *</label>
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
            <label for="birthDate">Data di nascita (opzionale)</label>
            <input v-model="form.birthDate" type="date" id="birthDate" :class="{ error: errors.birthDate }"/>
          </div>

          <div class="form-group">
            <label for="averageGrade">Media universitaria (opzionale)</label>
            <input v-model.number="form.averageGrade" type="number" id="averageGrade" min="18" max="30" step="0.1" :class="{ error: errors.averageGrade }" />         
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
import defaultPhotoPath from '@/assets/images/user.png'
import { login, toBase64 } from '@/composables/auth'
import { inject } from "vue";
import { getCurrentUser } from '@/composables/auth'
const socket = inject("socket");

const { toggleTheme } = useDarkMode()
const router = useRouter()
const defaultPhoto = defaultPhotoPath
const photoPreview = ref(null)
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

const errors = reactive({ email: false, password: false, birthDate: false, averageGrade: false })

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
  const file = e.target.files[0]
  if (file) {
    form.photo = file
    photoPreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  errors.email = false
  errors.password = false
  errors.birthDate = false

  const emailValid = form.email.endsWith('@studio.unibo.it')
  const passwordValid = /^(?=.*[0-9]).{6,}$/.test(form.password)
  
  let birthDateValid = true
  if (form.birthDate) {
    const today = new Date()
    const birthDate = new Date(form.birthDate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    if (age < 18) birthDateValid = false
  }

  let averageGradeValid = true
  if (form.averageGrade) {
    if (form.averageGrade < 18 || form.averageGrade > 30) {
      averageGradeValid = false
    }
  }

  if (!averageGradeValid) {
    showFieldError('averageGrade')
    showToast('❌ La media deve essere compresa tra 18 e 30')
  }

  if (!birthDateValid) {
    showFieldError('birthDate')
    showToast('❌ Devi essere maggiorenne per registrarti')
  }

  if (!passwordValid) {
    showFieldError('password')
    showToast('❌ La password deve avere almeno 6 caratteri e includere un numero')
  }

  if (!emailValid) {
    showFieldError('email')
    showToast('❌ Usa la tua email istituzionale @studio.unibo.it')
  }

  if (!emailValid || !passwordValid || !birthDateValid || !averageGradeValid) return

  const photoBase64 = form.photo ? await toBase64(form.photo) : null;
  
  const payload = { ...form, photo: photoBase64 }

  socket.emit("user:register", payload, (response) => {
    if (!response.success) {
      showToast("❌ " + response.error)
      return
    }

    socket.emit("session:login", { email: form.email, password: form.password }, (res) => {
      if (!res.success) {
        showToast("⚠️ Registrato ma non loggato: " + res.error)
        return
      }

      login(res.data) 
      showToast("✅ Registrazione completata con successo!")
      setTimeout(() => router.push("/"), 500)
    })
  })
}
</script>

<style scoped>
  .centered-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-pic-wrapper {
  position: relative;
  width: 85px;
  height: 85px;
  margin-bottom: 0.5rem;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--accent);
  box-shadow: var(--shadow-sm);
  background-color: var(--bg);
}

.edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.edit-icon:hover {
  background: var(--accent-hover);
  transform: scale(1.1);
}

.small-text {
  font-size: 0.8rem;
  margin-top: 0.2rem;
  opacity: 0.8;
}
</style>
