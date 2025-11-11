<template>
  <article class="lesson-card" :data-id="lesson.id">
    <div class="lesson-content">
      <div class="lesson-header">
        <h3 class="lesson-title">{{ lesson.title }}</h3>
        <div class="lesson-info">
          <span class="time">{{ lesson.time }}</span>
          <span class="duration">{{ lesson.duration }}</span>
          <span class="price">€{{ lesson.price }}</span>
        </div>
      </div>

      <div class="lesson-footer">
        <div class="lesson-author">{{ lesson.author }}</div>
        <div class="card-actions">
          <a href="/profilo" class="small btn-ghost" aria-label="Vedi profilo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M4 21v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </a>
          <button class="small btn-primary" @click="$emit('book', lesson)">Prenota</button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({ lesson: Object })
</script>
