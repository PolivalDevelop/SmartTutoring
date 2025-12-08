<template>
  <section class="profile-card" aria-describedby="profileInfo">
    <EditProfileDialog
          v-if="editProfileDialog.visible"
          :user="user"
          @close="editProfileDialog.visible = false"
          @save="updateUser"
        />

    <!-- HEADER -->
    <div class="profile-header">
      <img
        :src="photoUrl"
        :alt="`Foto profilo di ${user.firstName} ${user.lastName}`"
        class="profile-photo"
      />

      <div class="profile-main">
        <h2 class="profile-name">{{ user.firstName }} {{ user.lastName }}</h2>
        <p class="profile-role">{{ fullDegreeInfo }}</p>

        <!-- Rating sempre visibile -->
        <div class="profile-rating" aria-label="Valutazione media utente">
          <span class="stars">{{ '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating) }}</span>
          <span class="rating-value">({{ 0 }} / 5)</span>
          <span class="rating-count">• {{ 0 }} valutazioni</span>
        </div>
      </div>
    </div>

    <hr />

    <!-- INFO -->
    <div id="profileInfo" class="profile-info">
      <div class="info-item">
        <strong>Email:</strong>
        <span>{{ user.email || '—' }}</span>
      </div>
      <div class="info-item">
        <strong>Data di nascita:</strong>
        <span>{{ new Date(user.birthDate).toLocaleDateString('it-IT') || '—' }}</span>
      </div>
    </div>

    <!-- BIO (se presente) -->
    <div v-if="user.bio" class="profile-bio">
      <h3>Bio</h3>
      <p>{{ user.bio }}</p>
    </div>

    <!-- ACTIONS -->
    <div class="profile-actions">
      <button class="btn btn-primary" @click="openEditProfile()">Modifica profilo</button>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import defaultPhotoPath from '@/assets/images/user.png'
import EditProfileDialog from '@/components/EditProfileDialog.vue'
import { ref, inject } from 'vue'
import { getCurrentUser } from '@/composables/auth.js'

const socket = inject("socket");

const editProfileDialog = ref({ visible: false })

const props = defineProps({
  user: { type: Object, required: true }
})

const defaultPhoto = defaultPhotoPath
const roundedRating = computed(() => Math.round(props.user?.avgRating || 0))
const photoUrl = computed(() =>
  props.user.photo && props.user.photo !== "null"
    ? "http://localhost:4000" + props.user.photo
    : defaultPhoto
);


const fullDegreeInfo = computed(() => {
  const degree = props.user.degreeType
  if (!degree) return '—'
  const formatted =
    degree === 'triennale' || degree === 'magistrale'
      ? `Studente ${degree.charAt(0).toUpperCase() + degree.slice(1)}`
      : degree.charAt(0).toUpperCase() + degree.slice(1)
  return `${formatted} — Ingegneria e Scienze Informatiche`
})

function openEditProfile() {
  console.log("Apertura dialog di modifica profilo.");
  editProfileDialog.value.visible = true
}

function updateUser(updatedUser) {
  socket.emit("user:updateProfile", getCurrentUser().value?.email, updatedUser, (response) => {
    if (!response.success) {
      console.error("Errore durante l'aggiornamento del profilo:", response.error);
      return;
    }
    getCurrentUser().value = response.data;
    props.user = response.data;
    console.log("Profilo aggiornato con successo:", response.data);
  }); 
  editProfileDialog.value.visible = false
}
</script>

<style scoped>
.profile-card {
  background: var(--card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  max-width: 850px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* HEADER */
.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: var(--shadow-md);
  border: 3px solid var(--accent-light);
}

.profile-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Allinea tutto a sinistra */
.profile-name,
.profile-role,
.profile-rating {
  text-align: left;
}

.profile-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
}

.profile-role {
  font-size: 1rem;
  color: var(--muted);
}

/* RATING */
.profile-rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.stars {
  color: #facc15;
  font-size: 1.1rem;
}

.rating-value {
  font-weight: 600;
  color: var(--text);
  font-size: 0.95rem;
}

.rating-count {
  color: var(--muted);
  font-size: 0.9rem;
}

/* INFO */
.profile-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem 2rem;
}

.info-item strong {
  color: var(--text);
  margin-bottom: 0.3rem;
  display: block;
}

.info-item span {
  color: var(--muted);
  font-size: 0.95rem;
}

/* BIO */
.profile-bio {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.profile-bio h3 {
  margin: 0 0 0.4rem 0;
  font-size: 1.1rem;
  color: var(--text);
}

.profile-bio p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ACTIONS */
.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .profile-card {
    padding: 1.5rem 1rem;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-photo {
    width: 100px;
    height: 100px;
  }

  .profile-name {
    font-size: 1.4rem;
  }

  .profile-actions {
    justify-content: center;
  }
}
</style>
