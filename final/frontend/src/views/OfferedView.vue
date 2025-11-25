<template>
  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">Lezioni offerte</h2>
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
        <h3 class="empty-title">Nessuna lezione offerta da te</h3>
        <p class="empty-text">
          {{ isLoggedIn ? 'Pubblica una lezione!' : 'Effettua l’accesso per pubblicare la tua prima lezione.' }}
        </p>
        <button
          v-if="isLoggedIn"
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
import { ref } from 'vue'
import LessonCard from '@/components/LessonCard.vue'
import FooterNote from '@/components/FooterNote.vue'
import { isLoggedIn } from '@/composables/auth.js'
import { inject } from "vue";
import { onMounted } from "vue";
import { getCurrentUser } from '../composables/auth';

const socket = inject("socket");

/**
 * Restituisce tutte le lezioni in cui l'utente è studente
 * @param {string} email - email dell'utente
 * @returns {Promise<Array>} array di lezioni
 */
function offeredLessons(email) {
  return new Promise((resolve, reject) => {
    socket.emit("lesson:myOffered", email, (response) => {
      if (!response.success) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}


const myOfferedLessons = ref([]); 

onMounted(() => {
  console.log("Recupero lezioni offerte per:", getCurrentUser().value.email);
  offeredLessons(getCurrentUser().value.email)
    .then(lessons => {
      console.log("Lezioni offerte:", lessons);
      myOfferedLessons.value = lessons;
    })
    .catch(err => {
      console.error("Errore nel recuperare le lezioni:", err);
    });
  console.log("Lezioni offerte caricate:", myOfferedLessons.value);  
});




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

