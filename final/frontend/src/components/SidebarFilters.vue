<template>
  <div 
    class="sidebar-backdrop" 
    v-if="isOpen" 
    @click="isOpen = false"
  ></div>

  <aside 
    class="sidebar" 
    :class="{ open: isOpen }" 
    role="complementary" 
    aria-labelledby="sidebarTitle"
  >
    <button 
      class="sidebar-tab" 
      @click="isOpen = !isOpen"
      aria-label="Toggle filters"
    >
      <span class="arrow-icon">{{ isOpen ? '‹' : '›' }}</span>
    </button>

    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2 id="sidebarTitle">Filtra risultati</h2>
        <button class="close-btn-mobile" @click="isOpen = false">✖</button>
      </div>
      
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

        <div class="control-group" v-if ="props.mode == 'null'">
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
    </div>
  </aside>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { matters } from '../composables/auth'

const props = defineProps({
  mode: {
    type: String,
    default: "null"
  }
})

const emit = defineEmits(['update:filters'])

// Stato locale apertura
const isOpen = ref(false)

const filters = reactive({
  course: '',
  author: '',
  date: null,
  minPrice: '',
  maxPrice: ''
})

watch(
  filters,
  () => {
    emit('update:filters', { ...filters })
  },
  { deep: true }
)
</script>

<style scoped>
/* --- STILE BASE (Comune) --- */
.sidebar {
  background: var(--card);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  /* Z-index alto per stare sopra header e contenuto */
  z-index: 1000; 
}

.sidebar-content {
  padding: 1rem;
  height: 100%;
  overflow-y: auto; /* Scroll se i filtri sono tanti */
}

.sidebar h2 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--text);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: .3rem;
}

input, select {
  padding: .6rem .7rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--bg);
  color: var(--text);
  width: 100%;
}

input:focus {
  border-color: var(--accent);
  outline: none;
}

.minmax {
  width: 50%;
}

.reset-date {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted);
}

/* --- DESKTOP (>= 880px) --- */
@media (min-width: 880px) {
  .sidebar {
    width: var(--sidebar-w);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 5.5rem;
    align-self: start;
    transform: none !important; /* Blocca animazioni mobile */
  }

  .sidebar-tab, .sidebar-backdrop, .close-btn-mobile {
    display: none !important;
  }
}

/* --- MOBILE (< 880px) --- */
@media (max-width: 879px) {
  
  /* 1. Il Velo Scuro */
  .sidebar-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 999; /* Sotto la sidebar (1000) ma sopra il sito */
    animation: fadeIn 0.3s ease;
  }

  /* 2. La Sidebar "Drawer" */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 85%; /* Occupa quasi tutto lo schermo */
    max-width: 320px;
    box-shadow: 2px 0 15px rgba(0,0,0,0.2);
    transform: translateX(-100%); /* Nascosta a sinistra */
    border-radius: 0; /* Squadrata su mobile */
  }

  /* Stato Aperto */
  .sidebar.open {
    transform: translateX(0);
  }

  /* 3. La "Linguetta" (Tab) */
  .sidebar-tab {
      position: absolute;
      
      /* CENTRATURA VERTICALE */
      top: 50%;
      transform: translateY(-50%); /* La sposta su del 50% della sua altezza per centrarla perfettamente */
      
      /* DIMENSIONI RIDOTTE */
      width: 28px;   /* Più stretta (prima era 40px) */
      height: 40px;  /* Più bassa (prima era 48px) */
      right: -28px;  /* Deve sporgere esattamente quanto la sua larghezza */
      
      /* STILE */
      background: var(--card);
      border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
      border-left: none; 
      border-radius: 0 8px 8px 0; /* Curvatura leggermente ridotta per le nuove dimensioni */
      box-shadow: 4px 1px 6px rgba(0,0,0,0.08); /* Ombra più delicata */
      
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--accent);
      font-size: 1.2rem; /* Icona un po' più piccola */
      padding-left: 2px; /* Piccolo aggiustamento ottico per centrare la freccia */
      z-index: 1001;
    }
  
  /* Piccola animazione icona */
  .arrow-icon {
    display: inline-block;
    transition: transform 0.3s;
  }

  /* 4. Tasto Chiudi interno */
  .close-btn-mobile {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: var(--text);
    padding: .5rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
</style>