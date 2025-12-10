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
        <h3 class="empty-title">Nessun report aperto</h3>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  text-align: center;
  background: var(--card);
  border-radius: var(--radius);
  padding: 2rem 1rem;
  box-shadow: var(--shadow-sm);
  min-height: 280px;
  color: var(--text);
  opacity: .9;
 
}

.empty-icon {
  font-size: 2.2rem;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
}

.empty-text {
  color: var(--muted);
  font-size: .95rem;
  max-width: 320px;
}

.empty-state .btn {
  margin-top: .5rem;
}



</style>
