const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

mongoose.set('strictQuery', true);

/**
 * Connects to MongoDB using Mongoose.
 * Includes connection event listeners and graceful shutdown handling.
 */
const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect is handled by the driver.');
    });

    return conn;
  } catch (error) {
    logger.error(`MongoDB initial connection failed: ${error.message}`);
    // Exit process with failure in case DB is unreachable on boot
    process.exit(1);
  }
};

/**
 * Gracefully closes the MongoDB connection.
 * Used on process termination signals.
 */
const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed gracefully.');
};

module.exports = { connectDB, disconnectDB };
