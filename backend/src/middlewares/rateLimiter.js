const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * General API rate limiter. Applied globally in app.js.
 * Stricter limiters (e.g. for auth endpoints) can be created
 * separately when those routes are implemented.
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
});

module.exports = { apiLimiter };
