const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Returns server uptime and DB connection status.
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const dbStatus = dbStates[mongoose.connection.readyState] || 'unknown';

    const payload = {
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV,
    };

    return new ApiResponse(200, payload, 'Server is healthy').send(res);
  })
);

module.exports = router;
