<template>
  <div class="app" role="application" aria-label="Piattaforma prenotazioni ripetizioni">
    <AppHeader @toggle-theme="toggleTheme" />

    <main class="access-container" role="main" aria-labelledby="registerTitle">
      <section class="access-card">
        <h2 id="registerTitle">Crea il tuo account</h2>
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-group">
            <label for="nome">Nome *</label>
            <input v-model.trim="form.nome" type="text" id="nome" required />
          </div>

          <div class="form-group">
            <label for="cognome">Cognome *</label>
            <input v-model.trim="form.cognome" type="text" id="cognome" required />
          </div>

          <div class="form-group">
            <label for="email">Email istituzionale *</label>
            <input
              v-model.trim="form.email"
              type="email"
              id="email"
              placeholder="nome.cognome@studio.unibo.it"
              required
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
              />
              <button type="button" class="password-toggle" @click="togglePassword" aria-label="Mostra password">
                <svg v-if="!showPassword" class="icon eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
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
            <label for="tipo">Tipo di corso *</label>
            <select v-model="form.tipo" id="tipo" required>
              <option value="">Seleziona...</option>
              <option value="triennale">Triennale</option>
              <option value="magistrale">Magistrale</option>
              <option value="dottorato">Dottorato</option>
            </select>
          </div>

          <hr aria-hidden="true" />

          <div class="form-group">
            <label for="foto">Foto profilo (opzionale)</label>
            <input type="file" id="foto" accept=".jpg,.png" @change="onFileChange" />
          </div>

          <div class="form-group">
            <label for="nascita">Data di nascita (opzionale)</label>
            <input v-model="form.nascita" type="date" id="nascita" />
          </div>

          <div class="form-group">
            <label for="media">Media universitaria (opzionale)</label>
            <input v-model.number="form.media" type="number" id="media" min="18" max="30" step="0.1" />
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
            <RouterLink to="/accedi">Accedi</RouterLink>
          </p>
        </form>
      </section>
    </main>

    <ToastNotification v-if="toast.visible" :message="toast.message" @close="toast.visible = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import useDarkMode from '@/composables/useDarkMode.js'


const { toggleTheme } = useDarkMode()
const router = useRouter()

const showPassword = ref(false)
const toast = ref({ visible: false, message: '' })
const form = ref({
  nome: '',
  cognome: '',
  email: '',
  password: '',
  tipo: '',
  foto: null,
  nascita: '',
  media: null,
  bio: ''
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

function onFileChange(e) {
  form.value.foto = e.target.files[0]
}

function showToast(message) {
  toast.value = { visible: true, message }
  setTimeout(() => (toast.value.visible = false), 3000)
}

function handleSubmit() {
  const emailValid = form.value.email.endsWith('@studio.unibo.it')
  const passwordValid = /^(?=.*[0-9]).{6,}$/.test(form.value.password)

  if (!emailValid) {
    showToast('❌ Usa la tua email istituzionale @studio.unibo.it')
    return
  }
  if (!passwordValid) {
    showToast('❌ La password deve avere almeno 6 caratteri e includere un numero')
    return
  }

  showToast('✅ Registrazione completata con successo!')
  setTimeout(() => router.push('/indexlogged'), 3000)
}
</script>

<style scoped>
.access-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
}

.access-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  margin-top: calc(1rem);
}


h2 {
  margin-top: 0;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  position: relative;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 2.4rem; /* spazio per l'icona */
}

input[readonly] {
  background: color-mix(in srgb, var(--muted) 10%, transparent);
  cursor: not-allowed;
  color: var(--muted);
}

.password-toggle {
  position: absolute;
  right: 0.3rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle svg {
  overflow: visible; 
}


.password-toggle .icon {
  width: 1.4rem;
  height: 1.4rem;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.password-toggle .hidden {
  opacity: 0;
  transform: scale(0.7);
  position: absolute;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.profile-pic-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--border-color, #ccc);
  background-color: #f0f0f0;
}

.edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary-color, #007bff);
  color: white;
  border-radius: 50%;
  padding: 4px 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-icon:hover {
  background: var(--primary-hover, #0056b3);
}



</style>  
