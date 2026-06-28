const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const env = require('./config/env');
const logger = require('./config/logger');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const xssSanitizer = require('./middlewares/xssSanitizer');
const routes = require('./routes');

const app = express();

// ---------------------------------------------------------------------------
// Security middlewares
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(mongoSanitize()); // strips $ and . operators from req.body/query/params
app.use(xssSanitizer); // sanitizes user input against XSS (in-house, replaces deprecated xss-clean)
app.use(hpp()); // protects against HTTP parameter pollution

// Apply general rate limiting to all API routes
app.use(env.API_PREFIX, apiLimiter);

// ---------------------------------------------------------------------------
// Core middlewares
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// HTTP request logging piped through Winston
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http?.(message.trim()) || logger.info(message.trim()) },
  })
);

// ---------------------------------------------------------------------------
// Static files (e.g. locally stored uploads before Cloudinary migration)
// ---------------------------------------------------------------------------
app.use('/uploads', express.static('uploads'));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Project Collaboration Tool API is running',
    docs: `${env.API_PREFIX}/health`,
  });
});

app.use(env.API_PREFIX, routes);

// ---------------------------------------------------------------------------
// 404 + Global error handler (must be registered last, in this order)
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
