<template>
  <aside class="sidebar" role="complementary" aria-labelledby="sidebarTitle">
    <h2 id="sidebarTitle">Mostra filtri</h2>
    <div class="controls">
      <div class="control-group">
        <label for="course">Materia</label>
        <input list="courses" id="course" placeholder="Seleziona o digita" v-model="filters.course" />
        <datalist id="courses">
          <option 
            v-for="matter in matters" 
            :key="matter" 
            :value="matter"
          >
            {{ matter }}
          </option>
        </datalist>
      </div>

      <div class="control-group">
        <label for="author">Insegnante</label>
        <input type="text" id="author" placeholder="email docente" v-model="filters.author" />
      </div>

      <div class="control-group">
        <label for="day">Data</label>

        <input
          id="day"
          type="date"
          v-model="filters.date"
          class="date-input"
        />
        
        <button
          v-if="filters.date"
          type="button"
          class="reset-date"
          @click="filters.date = null"
        >
          ✖
        </button>
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
import { reactive, watch } from 'vue'
import { matters } from '../composables/auth'

const emit = defineEmits(['update:filters'])

const filters = reactive({
  course: '',
  author: '',
  day: 'any',
  minPrice: null,
  maxPrice: null
})

/*
watch(
  filters,
  () => {
    emit('update:filters', { ...filters })
  },
  { deep: true }
)*/
</script>
<style scoped>
/* Sidebar */
.sidebar {
  background: var(--card);
  border-radius: var(--radius);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: var(--sidebar-w);
  margin: 0 auto;
}

.sidebar h2 {
  font-size: 1rem;
  margin-top: 0;
  color: var(--text);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: .25rem;
}

input, select {
  padding: .6rem .7rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--bg);
  color: var(--text);
  transition: border-color .2s;
}

input:focus, select:focus {
  border-color: var(--accent);
  outline: none;
}

.minmax {
  width: 50%;
}

@media (min-width: 880px) {
    .sidebar {
    position: sticky;
    top: 5.5rem;
    align-self: start;
    margin: 0;
  }
}


/* Desktop: sidebar sempre visibile, bottone nascosto */
@media (min-width: 880px) {
  .filters-toggle {
    display: none !important;
  }
  .sidebar {
    width: var(--sidebar-w);
    margin: 0;
    position: sticky;
    top: 5.5rem;
    align-self: start;
  }


}

/* Mobile: sidebar chiusa di default */
@media (max-width: 879px) {
  .filters-toggle {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    font-size: .9rem;
    padding: .4rem .7rem;
    border-radius: var(--radius);
    border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
    background: var(--card);
    color: var(--text);
    box-shadow: var(--shadow-sm);
    transition: background .2s ease;
  }

  .filters-toggle:hover {
    background: color-mix(in srgb, var(--accent) 10%, transparent);
  }

  /* Sidebar nascosta di default */
  .sidebar {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    transform: scaleY(0.97);
    transform-origin: top;
    transition: all .3s ease;
    margin-top: 0;
  }

  /* Sidebar aperta */
  .sidebar.open {
    max-height: 100vh;
    opacity: 1;
    pointer-events: auto;
    transform: scaleY(1);
    margin-top: 3.5rem;
  }

  /* Layout mobile: sidebar sopra risultati */
  .app {
    display: flex;
    flex-direction: column;
    padding-top: 4.5rem;
  }

  .content-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .5rem;
  }

  .filters-row {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
  }
}

</style>

