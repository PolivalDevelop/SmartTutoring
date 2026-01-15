<template>
  <div class="edit-dialog open" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="edit-overlay" tabindex="-1"></div>

    <div class="edit-panel" role="document">
      <div class="panel-header">
        <h2 id="editTitle">Modifica profilo</h2>
        <button class="dialog-close" aria-label="Chiudi" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="saveChanges" autocomplete="off">
        <div class="profile-pic-wrapper">
          <img
            :src="photoPreview || photouser || defaultPhoto"
            alt="Immagine del profilo"
            class="profile-pic"
          />
          <label for="uploadPic" class="edit-icon" title="Modifica immagine profilo">✎</label>
          <input type="file" id="uploadPic" accept="image/*" @change="onFileChange" hidden />
        </div>

        <div class="form-group">
          <label for="firstname">Nome</label>
          <input type="text" id="firstname" v-model="form.firstname" required />
        </div>

        <div class="form-group">
          <label for="lastname">Cognome</label>
          <input type="text" id="lastname" v-model="form.lastname" required />
        </div>

        <div class="form-group">
          <label for="degreeType">Tipo di corso</label>
          <select id="degreeType" v-model="form.degreeType" required>
            <option value="triennale">Triennale</option>
            <option value="magistrale">Magistrale</option>
            <option value="dottorato">Dottorato</option>
          </select>
        </div>

        <div class="form-group">
          <label for="birthDate">Data di nascita</label>
          <input type="date" id="birthDate" v-model="form.birthDate" />
        </div>

        <div class="form-group">
          <label for="averageGrade">Media universitaria</label>
          <input type="number" id="averageGrade" v-model.number="form.averageGrade" min="18" max="30" step="0.1" />
        </div>

        <div class="form-group full-width">
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
import { computed } from 'vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  user: { type: Object, required: true }
})

const defaultPhoto = defaultPhotoPath
const photoPreview = ref(null);

const photouser = computed(() =>
  props.user.photo && props.user.photo !== "null"
    ? "http://localhost:4000" + props.user.photo
    : defaultPhoto
);

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
.edit-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start; 
}

.edit-dialog.open {
  display: flex;
}

.edit-overlay {
  display: none; 
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
}

.edit-panel {
  position: relative;
  background: var(--bg); 
  width: 100%;
  height: 100%; 
  padding: 1rem;
  overflow-y: auto; 
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

#editTitle {
  margin: 0;
  font-size: 1.25rem;
}

.dialog-close {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--text);
  line-height: 1;
  padding: 0 0.5rem;
  cursor: pointer;
}

form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-bottom: 2rem; 
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 20%, transparent);
  background: var(--card); 
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: 2px solid var(--accent);
  border-color: var(--accent);
}

.profile-pic-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 1rem 0;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--card);
  box-shadow: 0 0 0 2px var(--accent-light);
}

.edit-icon {
  position: absolute;
  bottom: 0;
  transform: translateX(35px);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: var(--shadow-sm);
}

.dialog-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.dialog-actions .btn {
  width: 100%;
  justify-content: center;
  padding: 1rem; 
  font-size: 1rem;
}

@media(min-width: 600px) {
  .edit-dialog {
    align-items: center; 
    padding: 1rem;
  }

  .edit-overlay {
    display: block; 
  }

  .edit-panel {
    background: var(--card); 
    width: 100%;
    height: auto;
    max-width: 650px;
    max-height: 90vh; 
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 2rem;
  }

  .panel-header {
    margin-bottom: 2rem;
    border-bottom: none;
    position: static;
    background: transparent;
    padding-bottom: 0;
  }
  
  
  form {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    padding-bottom: 0;
  }

  .profile-pic-wrapper,
  .full-width,
  .dialog-actions {
    grid-column: span 2;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem; 
    background: var(--bg);
  }

  .dialog-actions {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .dialog-actions .btn {
    width: auto;
    padding: 0.5rem 1.25rem;
  }
}
</style>