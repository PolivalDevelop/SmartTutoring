<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="dialog">

      <h2 class="title">Conferma Ban</h2>

      <p class="message">
        Vuoi davvero bannare l'utente con email:<br>
        <strong>{{ email }}</strong>?
      </p>

      <div class="actions">
        <button class="btn btn-ghost" @click="$emit('close')">Chiudi</button>
        <button class="btn btn-danger" @click="$emit('ban', email)">Banna</button>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  email: { type: String, required: true }
});

defineEmits(["close", "ban"]);
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog {
  background: var(--card);
  padding: 1.6rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 380px;
  width: 100%;
  text-align: center;
  animation: fadeIn .15s ease-out;
}

.title {
  margin: 0 0 0.6rem 0;
  font-size: 1.4rem;
  color: var(--text);
}

.message {
  color: var(--muted);
  margin-bottom: 1.4rem;
  line-height: 1.4;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: .45rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: .2s;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: .45rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
