<template>
  <CreateReviewDialog
    v-if="createReviewDialog.visible"
    :teacherEmail="user?.email"
    :studentEmail="getCurrentUser().value?.email"
    @createReview="createReview"
    @close="createReviewDialog.visible = false"
    @show-toast="$emit('show-toast', $event)" 
  />

  <CreateReportDialog
    v-if="createReportDialog.visible"
    :reportedEmail="user?.email"
    :reporterEmail="getCurrentUser().value?.email"
    @createReport="createReport"
    @close="createReportDialog.visible = false"
    @show-toast="$emit('show-toast', $event)"
  /> 
  
  <BanDialog
    v-if="isAdmin && banDialogVisible.visible"
    :email="user?.email"
    @ban="banUser"
    @close="banDialogVisible.visible = false"
    @show-toast="$emit('show-toast', $event)"
  />

  <section class="profile-card" aria-describedby="profileInfo">
    <!-- HEADER -->
    <div class="profile-header">
      <img
        :src="photoUrl"
        :alt="`Foto profilo di ${user?.firstName} ${user?.lastName}`"
        class="profile-photo"
      />

      <div class="profile-main">
        <h2 class="profile-name">{{ user?.firstName }} {{ user?.lastName }}</h2>
        <p class="profile-role">{{ fullDegreeInfo }}</p>

        <!-- Rating sempre visibile -->
        <div class="profile-rating" aria-label="Valutazione media utente">
          <span class="stars">{{ '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating) }}</span>
          <span class="rating-value">({{ (user?.avgRating || 0).toFixed(2) }} / 5)</span>
          <span class="rating-count">• {{  user?.numReviews || 0 }} valutazioni</span>
        </div>
      </div>
    </div>

    <hr />

    <!-- INFO -->
    <div id="profileInfo" class="profile-info">
      <div class="info-item">
        <strong>Email:</strong>
        <span>{{ user?.email || '—' }}</span>
      </div>
      <div class="info-item" v-if="user?.birthDate">
        <strong>Data di nascita:</strong>
        <span>{{ new Date(user?.birthDate).toLocaleDateString('it-IT') || '—' }}</span>
      </div>
    </div>

    <!-- BIO (se presente) -->
    <div v-if="user?.bio" class="profile-bio">
      <h3>Bio</h3>
      <p>{{ user?.bio }}</p>
    </div>

    <!-- ACTIONS -->
    <div class="profile-actions">
      <button class="btn btn-ghost" v-if="getCurrentUser()?.value && !isAdmin.value" @click="openCreateReport()">Segnala Profilo</button>
      <button class="btn btn-ghost" v-if="isAdmin" @click="openBan()">Banna</button>
      <button class="btn btn-primary" @click="goToLessons()">Visualizza lezioni</button>
      <button class="btn btn-primary" v-if="getCurrentUser().value" @click="openCreateReview()">Crea recensione</button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { useRouter } from 'vue-router';
import defaultPhotoPath from '@/assets/images/user.png'
import CreateReviewDialog from '@/components/CreateReviewDialog.vue'
import CreateReportDialog from '@/components/CreateReportDialog.vue'
import BanDialog from './BanDialog.vue'
import { getCurrentUser, isAdmin } from '@/composables/auth.js'

const emit = defineEmits(['show-toast']);

const props = defineProps({
  user: { type: Object, required: true },
  isLogged: { type: Boolean, required: true }
})

const router = useRouter();
const socket = inject("socket");

const createReviewDialog = ref({ visible: false })
const createReportDialog = ref({ visible: false })
const banDialogVisible = ref({ visible: false })

const defaultPhoto = defaultPhotoPath

const photoUrl = computed(() =>
  props.user.photo && props.user.photo !== "null"
    ? "http://localhost:4000" + props.user.photo
    : defaultPhoto
);

const roundedRating = computed(() => Math.round(props.user?.avgRating || 0))

const fullDegreeInfo = computed(() => {
  const degree = props.user?.degreeType
  if (!degree) return '—'
  const formatted =
    degree === 'triennale' || degree === 'magistrale'
      ? `Studente ${degree.charAt(0).toUpperCase() + degree.slice(1)}`
      : degree.charAt(0).toUpperCase() + degree.slice(1)
  return `${formatted} — Ingegneria e Scienze Informatiche`
})

function goToLessons() {
  router.push(`/offered/${props.user?.email}`);
}

function openCreateReview() {
  createReviewDialog.value.visible = true
}

function openCreateReport() {
  console.log("Apro il dialog di creazione report");
  createReportDialog.value.visible = true
}

function openBan() {
  console.log("Apro il dialog di ban");
  banDialogVisible.value.visible = true
}

// --- LOGICA CON I TOAST ---

function createReview(newReview) {
  console.log("la nuova recensione è:", newReview);
  socket.emit("review:create", newReview, (response) => {
    if (!response.success) {
      console.log("Errore durante la creazione della recensione:", response.error);
      // Ora 'emit' è definito e funzionerà
      emit('show-toast', "❌ Errore durante la pubblicazione della recensione.");
      return;
    }
    console.log("Recensione creata con successo.");
    emit('show-toast', "✅ Recensione pubblicata con successo!");
  }); 
  createReviewDialog.value.visible = false
}

function createReport(newReport) {
  console.log("il nuovo report è:", newReport);
  socket.emit("report:create", newReport, (response) => {
    if (!response.success) {
      console.log("Errore durante la creazione del report:", response.error);
      emit('show-toast', "❌ Errore durante la segnalazione.");
      return;
    }
    console.log("Report creato con successo.");
    emit('show-toast', "✅ Segnalazione inviata agli amministratori.");
  }); 
  createReportDialog.value.visible = false
}

function banUser(email) {
  console.log("Banno l'utente con email:", email);
  socket.emit("user:delete", { email: getCurrentUser().value.email, targetEmail: email }, (response) => {
    if (!response.success) {
      console.log("Errore durante il ban dell'utente:", response.error);
      emit('show-toast', "❌ Errore durante il ban.");
      return;
    }
    console.log(response.message);
    emit('show-toast', "⛔ Utente bannato correttamente.");
    router.push("/");
  }); 
  banDialogVisible.value.visible = false
}
</script>

<style scoped>

.profile-card {
  background: var(--card);
  border-radius: var(--radius-xl);
  padding: 1.4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* HEADER mobile */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-light);
}

/* Testi centrati su mobile */
.profile-name,
.profile-role,
.profile-rating {
  text-align: center;
}

.profile-name {
  font-size: 1.3rem;
  font-weight: 700;
}

.profile-role {
  font-size: 0.95rem;
  color: var(--muted);
}

.profile-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.stars {
  color: #facc15;
  font-size: 1.05rem;
}

.rating-value {
  font-weight: 600;
}

.rating-count {
  color: var(--muted);
  font-size: 0.85rem;
}

/* INFO */
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-item strong {
  color: var(--text);
  display: block;
  margin-bottom: 0.2rem;
}

.info-item span {
  color: var(--muted);
  font-size: 0.95rem;
}

/* BIO */
.profile-bio {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1rem;
  border: 1px solid var(--border-light);
}

.profile-bio h3 {
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
}

.profile-bio p {
  margin: 0;
  line-height: 1.5;
}

/* ACTIONS (stacked on mobile) */
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.profile-actions .btn {
  width: 100%;
}

@media (min-width: 600px) {
  .profile-card {
    padding: 1.8rem;
    border-radius: var(--radius-xl);
  }

  .profile-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .profile-actions .btn {
    width: auto;
  }
}


@media (min-width: 900px) {
  .profile-header {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }

  .profile-photo {
    width: 120px;
    height: 120px;
  }

  .profile-main {
    flex: 1;
  }

  .profile-name,
  .profile-role,
  .profile-rating {
    text-align: left;
  }

  .profile-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem 2rem;
  }

  .profile-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    transition: 0.25s ease;
  }
}
</style>
