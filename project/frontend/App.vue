<template>
  <div id="app" class="container py-4">
    <h1 class="text-center mb-4">smart tutoring</h1>

    <!-- Qui andranno le tue pagine o componenti -->
    <router-view />
  </div>
</template>

<script setup>
// Nessuna logica ancora — puoi aggiungere qui import o composables
</script>

<style>
/* Stili di base, personalizzabili */
body {
  background-color: #f8f9fa;
  font-family: "Inter", sans-serif;
}

#app {
  min-height: 100vh;
}
</style>
