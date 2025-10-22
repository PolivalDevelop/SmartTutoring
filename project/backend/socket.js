// backend/socket.js
import { Server } from 'socket.io';

/**
 * Inizializza e gestisce Socket.io
 * @param {http.Server} server - Il server HTTP creato in app.js
 */
export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // in produzione meglio limitare al dominio frontend
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Nuovo client connesso:', socket.id);

    // Ascolta messaggi inviati dai client
    socket.on('messaggio', (msg) => {
      console.log('💬 Messaggio ricevuto:', msg);

      // Re-invia a tutti i client
      io.emit('messaggio', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnesso:', socket.id);
    });
  });

  return io;
}
