<template>
  <article class="review-card" :data-id="review.id">
    <div class="review-content">
      <div class="review-header">
        <div class="review-info">
           <span class="stars">{{ '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating) }}</span> 
          <span class="date">{{ review.comment }}</span>
        </div>
      </div>
      <div class="review-footer">
        <div class="review-author">{{ review.student }}</div>
        <div class="card-actions">
          <RouterLink :to="`/profile/${review.student}`" class="small btn-ghost" aria-label="Vedi profilo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
  review: Object
})
</script>

<style scoped>
.review-card {
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

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.review-card.removing {
  opacity: 0;
  transform: translateY(-6px) scale(.995);
  transition: opacity .18s ease, transform .18s ease;
}

.review-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  height: 100%;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.2rem;
}

.review-line {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  align-items: center;
  gap: .75rem;
}

.review-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
}

.review-info {
  display: flex;
  gap: 0.5rem;
  color: var(--muted);
  font-size: 0.85rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.review-author {
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