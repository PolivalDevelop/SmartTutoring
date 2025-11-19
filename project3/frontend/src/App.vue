<script setup>
import { io } from "socket.io-client";

const socket = io("http://backend:4000"); // nome servizio docker!

const sendMessage = () => {
  socket.emit("message", "Ciao dal frontend Vue!");
};

socket.on("message", msg => {
  console.log("Messaggio ricevuto:", msg);
});
</script>

<template>
  <div>
    <h1>Vue + Socket.io</h1>
    <button @click="sendMessage">Invia messaggio</button>
  </div>
</template>
