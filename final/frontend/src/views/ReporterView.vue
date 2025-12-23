<template>
  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">Report aperti</h2>
    </div>

    <section class="results" id="reportsList">
      <ReportCard
        v-for="report in reports"
        :key="report._id"
        :report="report"
        @delete-report="deleteReport"
        v-if="reports.length > 0"
      />
      <!-- Stato vuoto -->
      <div v-else class="empty-state" role="status" aria-live="polite">
        <div class="empty-illustration">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="empty-title">Tutto tranquillo!</h3>
        <p class="empty-text">Non ci sono segnalazioni aperte al momento.</p>
      </div>
    </section>
  </main>

</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import ReportCard from '@/components/ReportCard.vue'
import { getCurrentUser } from '../composables/auth';
const emit = defineEmits(['show-toast']);
const socket = inject("socket");
const reports = ref([]);

onMounted(() => {

  // 1️⃣ Chiedo al server la lista delle lezioni disponibili
  socket.emit("report:getOpen", getCurrentUser().value.email);

  // 2️⃣ Ricevo la lista
  socket.on("report:open", (report) => {
    console.log("Ricevuta lista report aperti:", report);
    reports.value = report;
  });

  // 3️⃣ Aggiornamenti in tempo reale
  socket.on("report:updated", () => {
    console.log("Ricevuto aggiornamento report");
    socket.emit("report:getOpen", getCurrentUser().value.email); // Ricarica lista
  });
});

onUnmounted(() => {
  socket.off("report:open");
  socket.off("report:updated");
});

function deleteReport(report) {
  socket.emit("report:delete",getCurrentUser().value.email, report._id, (response) => {
    if (!response.success) {
      console.error("Errore durante l'eliminazione del report:", response.error);
      return;
    }else {
      console.log("Report eliminato con successo:", response.data);
      emit('show-toast', '✅ Report eliminato correttamente!');
    }
  });
}

</script>

<style scoped>
/* Main content */
main.content {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  width: 100%;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card);
  padding: .75rem 1rem;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 4rem;
  z-index: 900;
  flex-wrap: wrap;
}

.filters-row {
  display: flex;
  gap: .5rem;
  align-items: center;
  flex-wrap: wrap;
}

/* Lessons grid */
.results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 0 1rem 1rem;
}


/* Larger screens */
@media (min-width: 880px) {
  .results {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }

}

/* Empty state */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  color: var(--muted);
}

.empty-illustration svg {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  color: var(--primary); 
  opacity: 0.8;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.empty-text {
  font-size: 0.95rem;
  max-width: 400px;
  line-height: 1.5;
  opacity: 0.8;
}

.empty-icon {
  font-size: 2.2rem;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
}


.empty-state .btn {
  margin-top: .5rem;
}



</style>
