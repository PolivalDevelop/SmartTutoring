<template>
  <div class="edit-dialog open" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="edit-overlay" tabindex="-1"></div>

    <div class="edit-panel" role="document">
      <button class="dialog-close" aria-label="Chiudi" @click="$emit('close')">&times;</button>
      <h2 id="editTitle">Modifica il profilo</h2>

      <form @submit.prevent="saveChanges" autocomplete="off">
        <!-- Foto -->
        <div class="profile-pic-wrapper">
          <img
            :src="photoPreview || user.photo || defaultPhoto"
            alt="Immagine del profilo"
            class="profile-pic"
          />
          <label for="uploadPic" class="edit-icon" title="Modifica immagine profilo">✎</label>
          <input type="file" id="uploadPic" accept="image/*" @change="onFileChange" hidden />
        </div>

        <!-- Nome e Cognome -->
        <div class="form-group">
          <label for="firstname">Nome</label>
          <input type="text" id="firstname" v-model="form.firstname" required />
        </div>

        <div class="form-group">
          <label for="lastname">Cognome</label>
          <input type="text" id="lastname" v-model="form.lastname" required />
        </div>

        <!-- Tipo corso -->
        <div class="form-group">
          <label for="degreeType">Tipo di corso</label>
          <select id="degreeType" v-model="form.degreeType" required>
            <option value="triennale">Triennale</option>
            <option value="magistrale">Magistrale</option>
            <option value="dottorato">Dottorato</option>
          </select>
        </div>

        <!-- Data di nascita -->
        <div class="form-group">
          <label for="birthDate">Data di nascita</label>
          <input type="date" id="birthDate" v-model="form.birthDate" />
        </div>

        <!-- Media universitaria -->
        <div class="form-group">
          <label for="averageGrade">Media universitaria</label>
          <input type="number" id="averageGrade" v-model.number="form.averageGrade" min="18" max="30" step="0.1" />
        </div>

        <!-- Bio -->
        <div class="form-group">
          <label for="bio">Breve bio</label>
          <textarea id="bio" v-model="form.bio" rows="3" maxlength="300"></textarea>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" @click="$emit('close')">Annulla</button>
          <button type="submit" class="btn btn-primary">Salva modifiche</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import defaultPhotoPath from '@/assets/images/user.png'
import { toBase64 } from '@/composables/auth'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  user: { type: Object, required: true }
})
console.log("Utente da modificare:", props.user);

const defaultPhoto = defaultPhotoPath
const photoPreview = ref(null)

const form = reactive({
  firstname: props.user.firstName || '',
  lastname: props.user.lastName || '',
  degreeType: props.user.degreeType || '',
  birthDate: props.user.birthDate || '',
  averageGrade: props.user.averageGrade || null,
  bio: props.user.bio || '',
  photo: null
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  form.photo = file
  photoPreview.value = URL.createObjectURL(file)
}

async function saveChanges() {
  const photoBase64 = form.photo ? await toBase64(form.photo) : null;
  const updatedUser = {
    ...props.user,
    firstName: form.firstname,
    lastName: form.lastname,
    degreeType: form.degreeType,
    birthDate: form.birthDate,
    averageGrade: form.averageGrade,
    bio: form.bio,
    photo: photoBase64 || props.user.photo
  }
  emit('save', updatedUser)
  emit('close')
}
</script>

<style scoped>
/* DIALOG CONTAINER */
.edit-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-dialog.open {
  display: flex;
}

/* OVERLAY */
.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(1px);
}

/* PANEL COMPATTO */
.edit-panel {
  position: relative;
  background: var(--card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 1.5rem 1.5rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.2s ease;
}

/* CHIUDI DIALOG */
.dialog-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--muted);
  transition: color 0.2s;
}

.dialog-close:hover {
  color: var(--accent);
}

/* FORM COMPATTO CON DUE COLONNE */
form {
  display: grid;
  grid-template-columns: 1fr; /* mobile: una colonna */
  gap: 0.6rem;
}

@media(min-width: 600px) {
  form {
    grid-template-columns: 1fr 1fr; /* desktop: due colonne */
    gap: 1rem 1.2rem;
  }
}

/* GRUPPI FORM */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

/* INPUT E TEXTAREA */
.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
}

/* FOTO PROFILO PICCOLA */
.profile-pic-wrapper {
  display: flex;
  justify-content: center; /* centra orizzontalmente */
  align-items: center;     /* centra verticalmente se serve */
  grid-column: span 2;     /* occupa entrambe le colonne del form */
  gap: 0.5rem;             /* piccolo spazio per eventuale label */
}


.profile-pic {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-light);
  box-shadow: var(--shadow-sm);
}

.edit-icon {
  cursor: pointer;
  font-size: 1rem;
  padding: 0.15rem 0.4rem;
}

/* BOTTONI AZIONI */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  flex-wrap: wrap;
  grid-column: span 2; /* su due colonne */
}

.dialog-actions .btn {
  min-width: 80px;
}

/* RESPONSIVE MOBILE */
@media(max-width: 599px) {
  .edit-panel {
    padding: 1rem 1rem;
  }

  .profile-pic {
    width: 60px;
    height: 60px;
  }
}

/* ANIMAZIONE APERTURA */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
