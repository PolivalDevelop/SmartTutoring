const { Server } = require('socket.io');

const userSocketMap = {}; // username => socket.id

module.exports = (server, sessionMiddleware, corsRule) => {
  const io = new Server(server, { cors: corsRule });
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {

    const session = socket.request.session?.user;

    if (session !== undefined && session.username) {
      userSocketMap[session.username] = socket.id;
      console.log(`User ${session.username} connected with socket ${socket.id}`);
    }

    socket.on('disconnect', () => {
      if (session !== undefined && session.username) {
        delete userSocketMap[session.username];
        console.log(`User ${session.username} disconnected from socket ${socket.id}`);
      }
    });
  });
};
