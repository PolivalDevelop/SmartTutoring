import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Quando si connette
socket.on("connect", () => {
  console.log("✅ Connesso al server come client:", socket.id);

  // Prova a creare un utente
  socket.emit("user:create", {
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@studio.unibo.it",
    password: "123456",
    tipo: "triennale",
  });

  // Poi chiedi la lista utenti
  setTimeout(() => {
    socket.emit("user:getAll");
  }, 1000);
});

// Ricevi risposta creazione
socket.on("user:created", (user) => {
  console.log("👤 Utente creato:", user);
});

// Ricevi lista utenti
socket.on("user:list", (users) => {
  console.log("📜 Lista utenti:", users);
});

// Gestisci errori
socket.on("error", (err) => {
  console.error("⚠️ Errore:", err);
});
