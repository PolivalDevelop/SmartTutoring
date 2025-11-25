<template>
  <article class="lesson-card" :data-id="lesson.id">
    <div class="lesson-content">
      <div class="lesson-header">
        <h3 class="lesson-title">{{ lesson.subject }}</h3>
        <div class="lesson-info">
          <span class="time">{{ lesson.time }}</span>
          <span class="duration">{{ lesson.duration }}</span>
          <span class="price">€{{ lesson.price }}</span>
          <span class="date">{{ lesson.date }}</span>
        </div>
      </div>

      <div 
      v-if="mode !== 'offered'"
      class="lesson-footer">
        <div class="lesson-author">{{ lesson.teacher }}</div>
        <div class="card-actions">
          <RouterLink :to="`/profile/${lesson.teacher}`" class="small btn-ghost" aria-label="Vedi profilo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </RouterLink>
          <button 
            v-if="mode === 'available'"
            class="small btn-primary" 
            @click="$emit('book', lesson)"
          >
            Prenota
          </button>
        </div>
      </div>
      <div
      v-else-if="mode === 'offered' && !lesson.bookedBy"
      class="lesson-footer">
        <div class="lesson-author">Non ancora prenotata</div>
        <div class="card-actions">
          <button 
            class="small btn-ghost" 
            aria-label="Modifica lezione"
            @click="$emit('edit', lesson)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        </div>
        

        
      </div>
      <div
      v-else-if="mode === 'offered' && lesson.student"
      class="lesson-footer">
        <div class="lesson-author">Prenotata da {{ lesson.student }}</div>
        <div class="card-actions">
          <RouterLink :to="`/profile/${lesson.teacher}`" class="small btn-ghost" aria-label="Vedi profilo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </RouterLink>
          <button 
            class="small btn-primary" 
            disabled
          >
            Prenotata
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
  lesson: Object,
  mode: {
    type: String,
    default: "available"   // available | booked | offered
  }
})

const emit = defineEmits(["book", "edit"])
</script>

<style scoped>
.lesson-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 0.85rem 1rem;
  transition: transform .2s ease, box-shadow .2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  min-height: 110px;
}

.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.lesson-card.removing {
  opacity: 0;
  transform: translateY(-6px) scale(.995);
  transition: opacity .18s ease, transform .18s ease;
}

.lesson-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  height: 100%;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.lesson-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.2rem;
}

.lesson-line {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  align-items: center;
  gap: .75rem;
}

.lesson-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
}

.lesson-info {
  display: flex;
  gap: 0.5rem;
  color: var(--muted);
  font-size: 0.85rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.lesson-author {
  font-weight: 500;
  color: var(--muted);
  font-size: 0.85rem;
}

.card-actions {
  display: flex;
  gap: .4rem;
}

.small {
  font-size: .85rem;
  padding: .3rem .6rem;
}

.card-actions svg {
  width: 18px;
  height: 18px;
}

.btn-ghost svg {
  transition: transform 0.2s ease, color 0.2s ease;
}

.btn-ghost:hover svg {
  transform: scale(1.1);
  color: var(--accent);
}

/* Mobile */
@media (max-width: 600px) {
  .lesson-header, .lesson-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
  .lesson-info {
    justify-content: flex-start;
  }
  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Larger screens */
@media (min-width: 880px) {
  .lesson-line {
    grid-template-columns: 1fr auto;
    gap: .5rem;
  }
}

/* Bottoni disabilitati con tinta verde */
html[data-theme='light'] button:disabled {
  background-color: #d1fae5; /* verde pastello */
  color: #15803d;            /* verde scuro */
  border: 1px solid #15803d;
  opacity: 0.6;
  cursor: not-allowed;
}

html[data-theme='dark'] button:disabled {
  background-color: #1e3a2f; /* verde profondo */
  color: #4ade80;            /* verde chiaro */
  border: 1px solid #4ade80;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>