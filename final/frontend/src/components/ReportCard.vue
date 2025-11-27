<template>
  <article class="report-card">
    <div class="report-content">

      <!-- HEADER -->
      <div class="report-header">
        <h3 class="title">Segnalazione</h3>
        <span class="status" :class="report.status">
          {{ report.status }}
        </span>
      </div>

      <!-- REASON -->
      <div class="report-section">
        <strong>Motivo:</strong>
        <p>{{ report.reason }}</p>
      </div>

      <!-- COMMENT -->
      <div class="report-section" v-if="report.comment">
        <strong>Commento:</strong>
        <p>{{ report.comment }}</p>
      </div>

      <!-- FOOTER -->
      <div class="report-footer">

        <!-- Reporter -->
        <RouterLink :to="`/profile/${report.reporter}`" class="link-btn">
          👤 Segnalatore: {{ report.reporter }}
        </RouterLink>

        <!-- Reported -->
        <RouterLink :to="`/profile/${report.reported}`" class="link-btn">
          🚨 Segnalato: {{ report.reported }}
        </RouterLink>

        <!-- DELETE BUTTON -->
        <button class="btn-danger" @click="$emit('delete-report', report)">
          🗑️ Elimina
        </button>
      </div>

    </div>
  </article>
</template>

<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  report: { type: Object, required: true }
});

defineEmits(["delete-report"]);
</script>

<style scoped>
.report-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: 0.2s ease;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.status {
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

/* Colori stato */
.status.pending {
  background: #facc1533;
  color: #b45309;
}
.status.approved {
  background: #bbf7d033;
  color: #166534;
}
.status.rejected {
  background: #fecaca33;
  color: #991b1b;
}

.report-section strong {
  color: var(--text);
  font-size: 0.95rem;
}

.report-section p {
  margin: 0.2rem 0 0;
  color: var(--muted);
  line-height: 1.4;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: space-between;
  align-items: center;
}

.link-btn {
  text-decoration: none;
  color: var(--accent);
  font-size: 0.9rem;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-danger:hover {
  background: #b91c1c;
}
</style>
