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
}

const filteredLessons = computed(() => {
  return availableLessons.value.filter(lesson => {

    if (filters.value.course &&
        !lesson.subject.toLowerCase().includes(filters.value.course.toLowerCase())) {
      return false
    }

    if (filters.value.author &&
        !lesson.teacher.toLowerCase().includes(filters.value.author.toLowerCase())) {
      return false
    }

    if (filters.value.date) {
      const lessonDate = lesson.date.slice(0, 10)      
      const filterDate = filters.value.date.slice(0, 10)

      if (lessonDate !== filterDate) {
        return false
      }
    }

    if (filters.value.minPrice !== '' &&
        lesson.price < filters.value.minPrice) {
      return false
    }

    if (filters.value.maxPrice !== '' &&
        lesson.price > filters.value.maxPrice) {
      return false
    }

    return true
  })
})


onMounted(() => {

  socket.emit("lessons:getAvailable");

  socket.on("lessons:available", (lessons) => {
    if(isLoggedIn.value){
      const currentUserEmail = getCurrentUser().value.email;
      availableLessons.value = lessons.filter(lesson => lesson.teacher !== currentUserEmail);
    }else{
      availableLessons.value = lessons;
    }
  });

  socket.on("lessons:updated", () => {
    socket.emit("lessons:getAvailable"); 
  });
});

onUnmounted(() => {
  socket.off("lessons:available");
  socket.off("lessons:updated");
});



const emit = defineEmits(['book'])

function handleBook(lesson) {
  emit('book', lesson)
}



</script>

<style scoped>
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

.results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 1rem 1rem;
}


@media (min-width: 880px) {
  .results {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }

}

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

