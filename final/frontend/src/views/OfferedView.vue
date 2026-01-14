<template>
  <SidebarFilters mode="private" @update:filters="handleFiltersUpdate" />

  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">{{ pageTitle }}</h2>
    </div>

    <section class="results" id="lessonsList">
      <template v-if="filteredLessons.length > 0">
        <LessonCard
          v-for="lesson in filteredLessons"
          :key="lesson._id"
          :lesson="lesson"
          :mode="isOwner ? 'offered' : 'available'"
          @book="(lesson) => { console.log('book ricevuto', lesson); handleBook(lesson) }"
          @edit="(lesson) => { console.log('edit ricevuto', lesson); handleEdit(lesson) }"
        />
      </template>

      <div v-else class="empty-state" role="status" aria-live="polite">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">{{ emptyTitle }}</h3>
        <p class="empty-text">{{ emptyText }}</p>

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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import LessonCard from '@/components/LessonCard.vue';
import FooterNote from '@/components/FooterNote.vue';
import { getCurrentUser } from '@/composables/auth';
import { inject, onMounted, onUnmounted } from "vue";
import { isLoggedIn } from '../composables/auth';
import SidebarFilters from '@/components/SidebarFilters.vue'


const socket = inject("socket");
const route = useRoute();

const emit = defineEmits(['book', 'edit']);

const myOfferedLessons = ref([]);

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
  return myOfferedLessons.value.filter(lesson => {

    if (filters.value.course &&
        !lesson.subject.toLowerCase().includes(filters.value.course.toLowerCase())) {
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



const routeEmail = computed(() => route.params.email || getCurrentUser().value?.email);

const isOwner = computed(() => {
  return routeEmail.value === getCurrentUser().value?.email;
});


const pageTitle = computed(() =>
  isOwner.value ? "Lezioni offerte da te" : `Lezioni offerte da ${routeEmail.value}`
);

const emptyTitle = computed(() =>
  isOwner.value ? "Non hai ancora pubblicato lezioni" : "Nessuna lezione offerta da questo utente"
);

const emptyText = computed(() =>
  isOwner.value ? "Pubblica la tua prima lezione!" : "Questo utente non ha lezioni disponibili."
);


function fetchOfferedLessons(email) {
  return new Promise((resolve, reject) => {
    socket.emit("lesson:myOffered", email, (response) => {
      if (!response.success) reject(response.error);
      else resolve(response.data);
    });
  });
}


onMounted(() => {
  loadLessons();
  socket.on("lessons:updated", () => {
    loadLessons();
  });
});


watch(
  () => route.params.email,
  () => {
    loadLessons();
  }
);

function loadLessons() {
  const email = routeEmail.value;

  fetchOfferedLessons(email)
    .then(data => {
      if(isOwner.value){
        myOfferedLessons.value = data;
      }else{
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

function handleEdit(lesson) {
  emit('edit', lesson)
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

