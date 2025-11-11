<template>
  <section>
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
        @book="$emit('book', lesson)"
      />
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import LessonCard from '@/components/LessonCard.vue'

const sortOrder = ref('Più recenti')

const lessons = ref([
  { id: 1, title: 'Analisi', time: 'Mercoledì • 12:00', duration: '1h', price: 10, author: 'Marco Rossi' },
  { id: 2, title: 'Programmazione in C', time: 'Giovedì • 15:00', duration: '1.5h', price: 15, author: 'Laura Bianchi' },
  { id: 3, title: 'Inglese', time: 'Venerdì • 17:00', duration: '1h', price: 12, author: 'Teodoro Verdi' }
])
</script>
