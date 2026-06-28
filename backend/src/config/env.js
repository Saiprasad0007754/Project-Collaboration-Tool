const dotenv = require('dotenv');
const path = require('path');

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Centralized environment configuration.
 * Importing this file anywhere guarantees a single source of truth
 * for all environment variables, with sane defaults for local dev.
 */
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',

  MONGO_URI: process.env.MONGO_URI,
  MONGO_URI_TEST: process.env.MONGO_URI_TEST,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  JWT_COOKIE_EXPIRES_IN: parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 7,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Project Collab Tool',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'no-reply@projectcollabtool.com',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 200,

  MAX_FILE_UPLOAD_MB: parseInt(process.env.MAX_FILE_UPLOAD_MB, 10) || 10,
};

/**
 * Required variables for the server to function correctly.
 * Auth-related secrets are validated too since they're loaded now,
 * even though auth routes are not implemented yet.
 */
const REQUIRED_IN_PRODUCTION = ['MONGO_URI', 'JWT_SECRET'];

if (env.NODE_ENV === 'production') {
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`[ENV ERROR] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = env;
