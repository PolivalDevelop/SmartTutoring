// backend/app.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import initSocket from './socket.js'; // importa il file appena creato

const app = express();
app.use(cors());
app.use(express.json());

// Esempio di API REST classica
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funzionante!' });
});

// Crea il server HTTP e collega Socket.io
const server = http.createServer(app);
initSocket(server);

// Avvio
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend + Socket.io su porta ${PORT}`));
