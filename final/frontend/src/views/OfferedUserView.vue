<template>
  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">{{ pageTitle }}</h2>
    </div>

    <section class="results" id="lessonsList">
      <template v-if="myOfferedLessons.length > 0">
        <LessonCard
          v-for="lesson in myOfferedLessons"
          :key="lesson._id"
          :lesson="lesson"
          mode="offered"
        />
      </template>

      <!-- Stato vuoto -->
      <div v-else class="empty-state" role="status" aria-live="polite">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">{{ emptyTitle }}</h3>
        <p class="empty-text">{{ emptyText }}</p>

        <!-- Pulsante solo se stai vedendo le tue lezioni -->
        <button
          v-if="isOwner"
          class="btn btn-primary"
          @click="$emit('publish-request')"
        >
          Pubblica una lezione
        </button>
      </div>
    </section>

    <FooterNote />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import LessonCard from '@/components/LessonCard.vue';
import FooterNote from '@/components/FooterNote.vue';
import { getCurrentUser } from '@/composables/auth';
import { inject } from "vue";

const socket = inject("socket");
const route = useRoute();

const myOfferedLessons = ref([]);

/* -------------------------------------------
   EMAIL DA MOSTRARE
-------------------------------------------- */
const routeEmail = computed(() => route.params.email || getCurrentUser().value?.email);

/* Proprietario della pagina? */
const isOwner = computed(() => {
  return routeEmail.value === getCurrentUser().value?.email;
});

/* -------------------------------------------
   Titoli dinamici
-------------------------------------------- */
const pageTitle = computed(() =>
  isOwner.value ? "Lezioni offerte da te" : `Lezioni offerte da ${routeEmail.value}`
);

const emptyTitle = computed(() =>
  isOwner.value ? "Non hai ancora pubblicato lezioni" : "Nessuna lezione offerta da questo utente"
);

const emptyText = computed(() =>
  isOwner.value ? "Pubblica la tua prima lezione!" : "Questo utente non ha lezioni disponibili."
);

/* -------------------------------------------
   FETCH lezioni offerte
-------------------------------------------- */
function fetchOfferedLessons(email) {
  return new Promise((resolve, reject) => {
    socket.emit("lesson:myOffered", email, (response) => {
      if (!response.success) reject(response.error);
      else resolve(response.data);
    });
  });
}

/* -------------------------------------------
   CARICAMENTO INIZIALE
-------------------------------------------- */
onMounted(() => {
  loadLessons();
});

/* -------------------------------------------
   WATCH per route + email
   → ogni volta che la mail nella route cambia,
     si ricaricano le lezioni
-------------------------------------------- */
watch(
  () => route.params.email,
  () => {
    loadLessons();
  }
);

/* Funzione centralizzata */
function loadLessons() {
  const email = routeEmail.value;

  fetchOfferedLessons(email)
    .then(data => {
      myOfferedLessons.value = data;
    })
    .catch(err => {
      console.error("Errore nel recuperare le lezioni offerte:", err);
    });
}
</script>


<style scoped>
/* ... i tuoi stili identici, non modificati ... */
</style>
