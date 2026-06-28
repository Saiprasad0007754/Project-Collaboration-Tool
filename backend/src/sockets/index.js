const { Server } = require('socket.io');
const logger = require('../config/logger');
const env = require('../config/env');

let io;

/**
 * Initializes the Socket.IO server and attaches it to the HTTP server.
 * Call this once from server.js after the HTTP server is created.
 * @param {import('http').Server} httpServer
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    /**
     * Join a "room" representing a board/project so events can be
     * scoped instead of broadcast to every connected client.
     * Example payload: { roomId: 'board_123' }
     */
    socket.on('join_room', ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      logger.debug(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave_room', ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      logger.debug(`Socket ${socket.id} left room ${roomId}`);
    });

    // Placeholder for future real-time events:
    // task created/updated/moved, comment added, member joined, etc.
    // socket.on('task:update', (payload) => { ... io.to(roomId).emit(...) });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Returns the active Socket.IO instance.
 * Useful inside controllers/services to emit events after a DB write,
 * e.g.: getIO().to(boardId).emit('task:created', task);
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocket(server) first.');
  }
  return io;
};

module.exports = { initSocket, getIO };
