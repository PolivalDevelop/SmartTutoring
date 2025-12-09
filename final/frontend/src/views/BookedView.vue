<template>
  <SidebarFilters mode="private" @update:filters="handleFiltersUpdate" />
  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">Lezioni prenotate</h2>
    </div>

    <section class="results" id="lessonsList">
      <template v-if="filteredLessons.length > 0">
        <LessonCard
          v-for="lesson in filteredLessons"
          :key="lesson._id"
          :lesson="lesson"
          mode="booked"
        />
      </template>
      <!-- Stato vuoto -->
      <div v-else class="empty-state" role="status" aria-live="polite">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">Nessuna lezione prenotata</h3>
        <p class="empty-text">
          {{ isLoggedIn ? 'Prenota una lezione!' : 'Effettua l’accesso per prenotare la tua prima lezione.' }}
        </p>
        <RouterLink to="/" class="menu-item">Vedi le lezioni disponibili</RouterLink>      
      </div>
    </section>
    <FooterNote />
  </main>

</template>

<script setup>
import { ref, computed } from 'vue'
import LessonCard from '@/components/LessonCard.vue'
import FooterNote from '@/components/FooterNote.vue'
import { isLoggedIn } from '@/composables/auth.js'
import { socket } from "@/plugins/socket";
//import { useRoute } from 'vue-router'
import { onMounted } from "vue";
import { getCurrentUser } from '../composables/auth';
import SidebarFilters from '@/components/SidebarFilters.vue'

//const route = useRoute()

//const profileEmail = route.params.email

/**
 * Restituisce tutte le lezioni in cui l'utente è studente
 * @param {string} email - email dell'utente
 * @returns {Promise<Array>} array di lezioni
 */
function bookedLessons(email) {
  return new Promise((resolve, reject) => {
    socket.emit("lesson:myBooked", email, (response) => {
      if (!response.success) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}


const myBookedLessons = ref([]); 

const filters = ref({
  course: '',
  author: '',
  date: null,
  minPrice: '',
  maxPrice: ''
})

function handleFiltersUpdate(newFilters) {
  filters.value = newFilters  
  console.log("Filtri aggiornati in BookedView:", filters.value);
}

const filteredLessons = computed(() => {
  return myBookedLessons.value.filter(lesson => {

    // Materia
    if (filters.value.course &&
        !lesson.subject.toLowerCase().includes(filters.value.course.toLowerCase())) {
      return false
    }

    // Data
    if (filters.value.date) {
      const lessonDate = lesson.date.slice(0, 10)      // "2025-11-26"
      const filterDate = filters.value.date.slice(0, 10)

      if (lessonDate !== filterDate) {
        return false
      }
    }

    // Prezzo minimo
    if (filters.value.minPrice !== '' &&
        lesson.price < filters.value.minPrice) {
      return false
    }

    // Prezzo massimo
    if (filters.value.maxPrice !== '' &&
        lesson.price > filters.value.maxPrice) {
      return false
    }

    return true
  })
})


onMounted(() => {
  console.log("Recupero lezioni prenotate per l'utente:", getCurrentUser().value.email);
  bookedLessons(getCurrentUser().value.email)
    .then(lessons => {
      console.log("Lezioni prenotate:", lessons);
      myBookedLessons.value = lessons;
    })
    .catch(err => {
      console.error("Errore nel recuperare le lezioni:", err);
    });
  console.log("Lezioni prenotate caricate:", myBookedLessons.value);  
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

