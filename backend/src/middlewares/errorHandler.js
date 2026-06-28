const env = require('../config/env');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Converts known non-ApiError exceptions (Mongoose, JWT, etc.)
 * into a consistent ApiError so the response shape never varies.
 */
const normalizeError = (err) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose invalid ObjectId
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid value for field '${error.path}': ${error.value}`;
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join(', ');
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0];
      message = `Duplicate value for field '${field}': '${error.keyValue?.[field]}' already exists`;
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token has expired';
    }

    error = new ApiError(statusCode, message, error.errors || [], error.stack);
  }

  return error;
};

/**
 * 404 handler — placed after all routes, before the error handler.
 */
const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler — must be the LAST middleware registered.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);

  if (!error.isOperational || error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${error.message}`, { stack: error.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${error.message}`);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler, notFound };
