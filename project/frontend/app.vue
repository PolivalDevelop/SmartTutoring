<script setup>
import { io } from 'socket.io-client';
import { ref } from 'vue';

const socket = io('http://localhost:3000'); // oppure l’URL del backend se in container

const messaggio = ref('');
const messaggi = ref([]);

socket.on('connect', () => {
  console.log('Connesso al server socket.io');
});

socket.on('messaggio', (msg) => {
  messaggi.value.push(msg);
});

function invia() {
  socket.emit('messaggio', messaggio.value);
  messaggio.value = '';
}
</script>

<template>
  <div>
    <h2>Chat Realtime con Socket.io</h2>
    <ul>
      <li v-for="(m, i) in messaggi" :key="i">{{ m }}</li>
    </ul>
    <input v-model="messaggio" @keyup.enter="invia" placeholder="Scrivi un messaggio..." />
  </div>
</template>
