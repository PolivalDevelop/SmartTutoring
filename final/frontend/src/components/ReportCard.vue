<template>
  <article class="report-card">
    <div class="report-content">

      <div class="report-header">
        <h3 class="title">Segnalazione</h3>
        <span class="status" :class="report.status">
          {{ report.status }}
        </span>
      </div>

      <div class="report-body">
        <div class="info-row">
          <span class="label">Motivo:</span>
          <p class="text">{{ report.reason }}</p>
        </div>

        <div class="info-row" v-if="report.comment">
          <span class="label">Dettagli:</span>
          <p class="text">{{ report.comment }}</p>
        </div>
      </div>

      <div class="report-footer">
        
        <div class="users-container">
          <div class="user-row">
            <span class="role-icon" title="Segnalatore">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </span>
            <RouterLink :to="`/profile/${report.reporter}`" class="user-link">
              {{ report.reporter }}
            </RouterLink>
          </div>

          <div class="user-row">
            <span class="role-icon alert" title="Segnalato">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"></path><path d="M4 21v-2a4 4 0 0 1 3-3.87"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <RouterLink :to="`/profile/${report.reported}`" class="user-link">
              {{ report.reported }}
            </RouterLink>
          </div>
        </div>

        <div class="actions">
          <button class="btn-ghost delete-btn" @click="$emit('delete-report', report)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            Elimina
          </button>
        </div>
      </div>

    </div>
  </article>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  report: { type: Object, required: true }
});

defineEmits(["delete-report"]);
</script>

<style scoped>
.report-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid transparent;
  height: 100%; 
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
  padding-bottom: 0.6rem;
}

.title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

.status {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status.pending { background: #fff7ed; color: #c2410c; }
.status.approved { background: #f0fdf4; color: #15803d; }
.status.rejected { background: #fef2f2; color: #b91c1c; }

@media (prefers-color-scheme: dark) {
  .status.pending { background: rgba(194, 65, 12, 0.2); color: #fdba74; }
  .status.approved { background: rgba(21, 128, 61, 0.2); color: #86efac; }
  .status.rejected { background: rgba(185, 28, 28, 0.2); color: #fca5a5; }
}

.report-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
  font-weight: 700;
}

.text {
  margin: 0;
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word; 
}

.report-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.5rem;
}

.users-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: color-mix(in srgb, var(--text) 5%, transparent);
  padding: 0.75rem;
  border-radius: 8px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden; 
}

.role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  min-width: 16px; 
}

.role-icon.alert {
  color: #ef4444;
}

.user-link {
  text-decoration: none;
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;
  
  /* Gestione testo lungo */
  white-space: normal; 
  overflow-wrap: anywhere; 
  word-break: break-word;
  line-height: 1.2;
}

.user-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

.actions {
  display: flex;
  width: 100%;
}

.btn-ghost {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%; 
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: var(--radius);
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
  background: transparent;
  color: var(--muted);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: color-mix(in srgb, var(--text) 5%, transparent);
  color: var(--text);
}

.btn-ghost.delete-btn:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fca5a5;
}

@media (prefers-color-scheme: dark) {
  .btn-ghost.delete-btn:hover { 
    background: rgba(239, 68, 68, 0.2); 
    color: #fca5a5;
    border-color: rgba(239, 68, 68, 0.3);
  }
}

/* Tablet e Desktop: Layout leggermente diverso se serve */
@media (min-width: 600px) {
  .actions {
    width: auto;
    align-self: flex-end; 
  }
  
  .btn-ghost {
    width: auto; 
    padding: 0.35rem 0.8rem;
    font-size: 0.85rem;
  }

  .report-footer {
     gap: 0.75rem;
  }
}
</style>