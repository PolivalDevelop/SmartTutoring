<template>
  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">Lezioni disponibili</h2>
      <div class="filters-row">
        <span class="lesson-sub">Ordina per:</span>
        <select v-model="sortOrder">
          <option>Più recenti</option>
          <option>Prezzo crescente</option>
          <option>Prezzo decrescente</option>
        </select>
      </div>
    </div>

    <section class="results" id="lessonsList">
      <LessonCard
        v-for="lesson in lessons"
        :key="lesson.id"
        :lesson="lesson"
        @book="handleBook(lesson)"
      />
    </section>
    <FooterNote />
  </main>

</template>

<script setup>
import { ref } from 'vue'
import LessonCard from '@/components/LessonCard.vue'
import FooterNote from '@/components/FooterNote.vue'

import { lessons } from '@/composables/useLessons.js'

const sortOrder = ref('Più recenti')

function addLesson(lesson) {
  lessons.value.unshift(lesson)
}

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


</style>

