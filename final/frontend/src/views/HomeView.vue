<template>
  <SidebarFilters @update:filters="handleFiltersUpdate" />

  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">Lezioni disponibili</h2>
    </div>

    <section class="results" id="lessonsList">
      <LessonCard
        v-for="lesson in filteredLessons"
        mode="available"
        :key="lesson.id"
        :lesson="lesson"
        @book="handleBook(lesson)"
        v-if="filteredLessons.length > 0"
      />
      <!-- Stato vuoto -->
      <div v-else class="empty-state" role="status" aria-live="polite">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">Nessuna lezione disponibile</h3>
        <p class="empty-text">
          {{ isLoggedIn ? 'Pubblica tu una lezione o controlla più tardi!' : 'Effettua l’accesso per pubblicare la tua prima lezione.' }}
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
import { ref, computed } from 'vue'
import LessonCard from '@/components/LessonCard.vue'
import FooterNote from '@/components/FooterNote.vue'
import { isLoggedIn, getCurrentUser } from '@/composables/auth.js'
import { inject, onMounted, onUnmounted } from "vue";
import SidebarFilters from '@/components/SidebarFilters.vue'

const socket = inject("socket");
const availableLessons = ref([]);

const filters = ref({
  course: '',
  author: '',
  date: null,
  minPrice: '',
  maxPrice: ''
})

function handleFiltersUpdate(newFilters) {
  filters.value = newFilters  
  console.log("Filtri aggiornati in HomeView:", filters.value);
}

const filteredLessons = computed(() => {
  return availableLessons.value.filter(lesson => {

    // Materia
    if (filters.value.course &&
        !lesson.subject.toLowerCase().includes(filters.value.course.toLowerCase())) {
      return false
    }

    // Autore
    if (filters.value.author &&
        !lesson.teacher.toLowerCase().includes(filters.value.author.toLowerCase())) {
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

  // 1️⃣ Chiedo al server la lista delle lezioni disponibili
  socket.emit("lessons:getAvailable");

  // 2️⃣ Ricevo la lista
  socket.on("lessons:available", (lessons) => {
    if(isLoggedIn.value){
      console.log("Utente loggato, applico filtro per escludere le proprie lezioni.");
      const currentUserEmail = getCurrentUser().value.email;
      lessons = lessons.filter(lesson => lesson.teacher !== currentUserEmail);
    }else{
      console.log("Utente non loggato, nessun filtro applicato.");
      availableLessons.value = lessons;
    }
    console.log("Lezioni aggiornate:", lessons);
    console.log("utente Attivo:  ", getCurrentUser().value)
  });

  // 3️⃣ Aggiornamenti in tempo reale
  socket.on("lessons:updated", () => {
    socket.emit("lessons:getAvailable"); // Ricarica lista
  });
});

onUnmounted(() => {
  socket.off("lessons:available");
  socket.off("lessons:updated");
});



// Emit verso App.vue
const emit = defineEmits(['book'])

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

