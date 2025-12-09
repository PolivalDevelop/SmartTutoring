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
            <option v-for="matter in matters" :key="matter" :value="matter">{{ matter }}</option>
          </datalist>
        </div>

        <div class="control-group" v-if="props.mode == 'null'">
          <label for="author">Insegnante</label>
          <input type="text" id="author" placeholder="email docente" v-model="filters.author" />
        </div>

        <div class="control-group">
          <label>Data</label>
          
          <div class="custom-date-wrapper" @click="openCalendar">
            
            <div class="fake-input" :class="{ 'has-value': filters.date }">
              {{ formattedDateLabel }}
            </div>

            <input 
              ref="dateInputRef"
              type="date" 
              v-model="filters.date"
              class="ghost-date-input"
              @click.stop
            />
            
            <span v-if="!filters.date" class="calendar-icon">📅</span>

            <button
              v-if="filters.date"
              type="button"
              class="reset-date"
              @click.stop="filters.date = null"
            >
              ✖
            </button>
          </div>
        </div>

        <div class="control-group">
          <label>Prezzo (€)</label>
          <div style="display:flex; gap:.5rem">
            <input class="minmax" type="number" min="0" placeholder="min" v-model.number="filters.minPrice" />
            <input class="minmax" type="number" min="0" placeholder="max" v-model.number="filters.maxPrice" />
          </div>
        </div>

      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue'
import { matters } from '../composables/auth'

const props = defineProps({
  mode: { type: String, default: "null" }
})

const emit = defineEmits(['update:filters'])
const isOpen = ref(false)
const dateInputRef = ref(null) 

const filters = reactive({
  course: '',
  author: '',
  date: null,
  minPrice: '',
  maxPrice: ''
})

const formattedDateLabel = computed(() => {
  if (!filters.date) return 'Seleziona data';
  try {
    const [year, month, day] = filters.date.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return filters.date;
  }
})

function openCalendar() {
  if (dateInputRef.value) {
    if (typeof dateInputRef.value.showPicker === 'function') {
      dateInputRef.value.showPicker();
    } else {
      dateInputRef.value.focus();
    }
  }
}

watch(filters, () => {
  emit('update:filters', { ...filters })
}, { deep: true })
</script>

<style scoped>
.sidebar {
  background: var(--card);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
}

.sidebar-content {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}

.sidebar h2 {
  font-size: 1.1rem;
  margin: 0;
  color: var(--text);
}

.sidebar-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;
}

.controls { display: flex; flex-direction: column; gap: 1rem; }
.control-group { display: flex; flex-direction: column; gap: .3rem; }

input:not(.ghost-date-input), select {
  padding: .6rem .7rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--bg);
  color: var(--text);
  width: 100%;
  box-sizing: border-box;
}

input:focus { border-color: var(--accent); outline: none; }
.minmax { width: 50%; }

.custom-date-wrapper {
  position: relative;
  width: 100%;
  height: 42px;
  cursor: pointer; 
}

.fake-input {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 .7rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--bg);
  color: var(--muted, #888);
  font-size: 13.33px;
  box-sizing: border-box;
  pointer-events: none;
}

.fake-input.has-value {
  color: var(--text);
}

.ghost-date-input {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; 
  z-index: 10;
  pointer-events: none; 
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
  opacity: 0.6;
}

.reset-date {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-weight: bold;
  z-index: 20;
  padding: 5px;
}

@media (min-width: 880px) {
  .sidebar {
    width: var(--sidebar-w);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    position: sticky; top: 5.5rem; align-self: start;
    transform: none !important;
  }
  .sidebar-tab, .sidebar-backdrop, .close-btn-mobile { display: none !important; }
}

@media (max-width: 879px) {
  .sidebar-backdrop {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);
    z-index: 999; animation: fadeIn 0.3s ease;
  }

  .sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 85%; max-width: 320px;
    box-shadow: 2px 0 15px rgba(0,0,0,0.2);
    transform: translateX(-100%);
    border-radius: 0;
  }
  .sidebar.open { transform: translateX(0); }

  .sidebar-tab {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 28px; height: 40px; right: -28px;
    background: var(--card);
    border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
    border-left: none; border-radius: 0 8px 8px 0;
    box-shadow: 4px 1px 6px rgba(0,0,0,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--accent); font-size: 1.2rem;
    padding-left: 2px; z-index: 1001;
  }
  
  .arrow-icon { line-height: 1; }
  .close-btn-mobile { background: none; border: none; font-size: 1.2rem; color: var(--text); padding: .5rem; cursor: pointer; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
}
</style>