<template>
  <main class="content" role="main" aria-labelledby="mainTitle">
    <div class="content-header">
      <h2 id="mainTitle">Report aperti</h2>
    </div>

    <section class="results" id="reportsList">
      <ReportCard
        v-for="report in reports"
        mode="available"
        :key="report.id"
        :report="report"
        v-if="reports.length > 0"
      />
      <!-- Stato vuoto -->
      <div v-else class="empty-state" role="status" aria-live="polite">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">Nessun report aperto</h3>
      </div>
    </section>
  </main>

</template>