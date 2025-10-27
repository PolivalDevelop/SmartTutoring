import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import User from './models/User'; // il file che hai postato

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/myapp');

// Evento di connessione socket
io.on('connection', (socket) => {
  console.log(`🟢 Nuovo client connesso: ${socket.id}`);

  // Eventi CRUD user
  socket.on('user:create', async (data) => {
    try {
      const newUser = await User.create(data);
      io.emit('user:created', newUser); // broadcast a tutti
    } catch (err) {
      socket.emit('error', { type: 'user:create', message: (err as Error).message });
    }
  });

  socket.on('user:getAll', async () => {
    const users = await User.find().select('-password');
    socket.emit('user:list', users);
  });

  socket.on('user:getById', async (id: string) => {
    try {
      const user = await User.findById(id).select('-password');
      if (!user) throw new Error('Utente non trovato');
      socket.emit('user:details', user);
    } catch (err) {
      socket.emit('error', { type: 'user:getById', message: (err as Error).message });
    }
  });

  socket.on('user:update', async ({ id, updates }) => {
    try {
      const updated = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
      if (!updated) throw new Error('Utente non trovato');
      io.emit('user:updated', updated);
    } catch (err) {
      socket.emit('error', { type: 'user:update', message: (err as Error).message });
    }
  });

  socket.on('user:delete', async (id: string) => {
    try {
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) throw new Error('Utente non trovato');
      io.emit('user:deleted', id);
    } catch (err) {
      socket.emit('error', { type: 'user:delete', message: (err as Error).message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnesso: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server Socket.IO attivo su http://localhost:3000');
});
