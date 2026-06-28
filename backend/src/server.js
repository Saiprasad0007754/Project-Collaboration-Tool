const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDB, disconnectDB } = require('./config/db');
const { initSocket } = require('./sockets');

const httpServer = http.createServer(app);

// Attach Socket.IO to the same HTTP server instance
initSocket(httpServer);

const startServer = async () => {
  await connectDB();

  httpServer.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`API base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
  });
};

startServer();

// -----------------------------------------------------------------------------
// Process-level safety nets
// -----------------------------------------------------------------------------
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason instanceof Error ? reason.stack : reason}`);
  // Let the process exit gracefully rather than continuing in a corrupted state
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.stack}`);
  gracefulShutdown('uncaughtException');
});

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  httpServer.close(async () => {
    await disconnectDB();
    process.exit(0);
  });

  // Force exit if shutdown takes too long
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = httpServer;
