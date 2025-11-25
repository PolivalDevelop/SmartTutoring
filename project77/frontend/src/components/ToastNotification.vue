<template>
  <div class="toast show" role="status" aria-live="polite">
    <span>{{ message }}</span>
    <button id="toastClose" aria-label="Chiudi notifica" @click="$emit('close')">✖</button>
  </div>
</template>

<script setup>
defineProps({ message: String })
</script>
