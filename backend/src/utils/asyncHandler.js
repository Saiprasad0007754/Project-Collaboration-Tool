/**
 * Wraps an async Express route handler and forwards any rejected
 * promise / thrown error to Express's `next()` so the centralized
 * error handler middleware can process it.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
