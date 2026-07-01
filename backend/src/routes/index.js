const express = require('express');
const healthRoutes = require('./health.routes');
const projectRoutes = require('./project.routes');

const router = express.Router();

/**
 * Central route registry.
 * As features are built (auth, users, projects, boards, tasks, comments, etc.)
 * register their routers here, e.g.:
 *   const authRoutes = require('./auth.routes');
 *   router.use('/auth', authRoutes);
 */
router.use('/health', healthRoutes);
router.use('/projects', projectRoutes);

// Placeholder routers to be implemented in upcoming phases:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/workspaces', workspaceRoutes);
// router.use('/boards', boardRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/comments', commentRoutes);
// router.use('/notifications', notificationRoutes);

module.exports = router;
