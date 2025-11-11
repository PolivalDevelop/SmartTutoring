<template>
  <aside class="sidebar" role="complementary" aria-labelledby="sidebarTitle">
    <h2 id="sidebarTitle">Mostra filtri</h2>
    <div class="controls">
      <div class="control-group">
        <label for="course">Materia</label>
        <input list="courses" id="course" placeholder="Seleziona o digita" v-model="filters.course" />
        <datalist id="courses">
          <option value="Analisi" />
          <option value="Programmazione in C" />
          <option value="Inglese" />
        </datalist>
      </div>

      <div class="control-group">
        <label for="author">Autore</label>
        <input type="text" id="author" placeholder="Nome docente" v-model="filters.author" />
      </div>

      <div class="control-group">
        <label for="day">Giorno</label>
        <select id="day" v-model="filters.day">
          <option value="any">Qualsiasi giorno</option>
          <option>Lunedì</option>
          <option>Martedì</option>
          <option>Mercoledì</option>
          <option>Giovedì</option>
          <option>Venerdì</option>
        </select>
      </div>

      <div class="control-group">
        <label>Prezzo (€)</label>
        <div style="display:flex;gap:.5rem">
          <input class="minmax" type="number" min="0" placeholder="min" v-model.number="filters.minPrice" />
          <input class="minmax" type="number" min="0" placeholder="max" v-model.number="filters.maxPrice" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive } from 'vue'
const filters = reactive({
  course: '',
  author: '',
  day: 'any',
  minPrice: null,
  maxPrice: null
})
</script>

