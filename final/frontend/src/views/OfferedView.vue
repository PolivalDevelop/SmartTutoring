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
          :mode="isOwner ? 'offered' : 'available'"
          v-if="!isOwner" @book="handleBook(lesson)"
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
      if(isOwner.value){
        console.log("Utente proprietario della pagina, mostro tutte le lezioni offerte.");
        myOfferedLessons.value = data;
      }else{
        console.log("Utente non proprietario, applico filtro per escludere le proprie lezioni.");
        const lessons = data.filter(lesson => lesson.status === 'available');
        myOfferedLessons.value = lessons;
      }
    })
    .catch(err => {
      console.error("Errore nel recuperare le lezioni offerte:", err);
    });
}

function handleBook(lesson) {
  emit('book', lesson)
}
</script>


<style scoped>
/* Main content */
main.content {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  width: 100%;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card);
  padding: .75rem 1rem;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 4rem;
  z-index: 900;
  flex-wrap: wrap;
}

.filters-row {
  display: flex;
  gap: .5rem;
  align-items: center;
  flex-wrap: wrap;
}

/* Lessons grid */
.results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 1rem 1rem;
}


/* Larger screens */
@media (min-width: 880px) {
  .results {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }

}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  text-align: center;
  background: var(--card);
  border-radius: var(--radius);
  padding: 2rem 1rem;
  box-shadow: var(--shadow-sm);
  min-height: 280px;
  color: var(--text);
  opacity: .9;
 
}

.empty-icon {
  font-size: 2.2rem;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
}

.empty-text {
  color: var(--muted);
  font-size: .95rem;
  max-width: 320px;
}

.empty-state .btn {
  margin-top: .5rem;
}



</style>

