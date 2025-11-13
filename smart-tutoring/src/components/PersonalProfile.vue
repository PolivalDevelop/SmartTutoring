<!-- src/components/PersonalProfile.vue -->
<template>
  <section class="profile-card" aria-describedby="profileInfo">
    <!-- HEADER -->
    <div class="profile-header">
      <img :src="user.photo" :alt="`Foto profilo di ${user.name}`" class="profile-photo" />
      <div>
        <h2>{{ user.name }}</h2>
        <p class="profile-sub">{{ user.subtitle }}</p>
      </div>
    </div>

    <!-- RATING -->
    <div class="profile-rating" aria-label="Valutazione media utente">
      <span class="stars">{{ '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating) }}</span>
      <span class="rating-value">({{ user.rating }} / 5)</span>
      <span class="rating-count">• {{ user.reviewsCount }} valutazioni</span>
    </div>

    <hr />

    <!-- INFO -->
    <div id="profileInfo" class="profile-info">
      <div v-for="(value, label) in userInfo" :key="label" class="info-item">
        <strong>{{ label }}:</strong>
        <span v-if="typeof value === 'string'">{{ value }}</span>
        <p v-else>{{ value }}</p>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="profile-actions">
      <button class="btn btn-ghost" @click="$emit('view-balance')">Visualizza saldo</button>
      <button class="btn btn-primary" @click="$emit('edit-profile')">Modifica profilo</button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const roundedRating = computed(() => Math.round(props.user.rating))
const userInfo = computed(() => ({
  'Email': props.user.email,
  'Tipo di corso': props.user.degreeType,
  'Data di nascita': props.user.birthDate || '—',
  'Media universitaria': props.user.avgGrade ? `${props.user.avgGrade} / 30` : '—',
  'Bio': props.user.bio || '—'
}))
</script>

<style scoped>
.profile-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: var(--shadow-sm);
}

.profile-sub {
  color: var(--muted);
  margin: 0.25rem 0 0;
}

.profile-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--muted);
}

.stars {
  color: #fbbf24; /* giallo stelle */
  font-size: 1rem;
  letter-spacing: 1px;
}

.rating-value {
  font-weight: 500;
  color: var(--text);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item strong {
  display: inline-block;
  width: 50%;
  color: var(--text);
}

.info-item span,
.info-item p {
  color: var(--muted);
  margin: 0;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.footer-note {
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 2rem;
}

/* === Mobile First === */
@media (max-width: 600px) {
  .profile-card {
    padding: 1.5rem 1rem;
  }
  .info-item strong {
    width: auto;
    display: block;
    margin-bottom: 0.25rem;
  }
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .profile-actions {
    justify-content: center;
  }
}

/* === Desktop === */
@media (min-width: 900px) {
  .profile-card {
    padding: 2.5rem 2rem;
  }
  .profile-photo {
    width: 110px;
    height: 110px;
  }
}
</style>