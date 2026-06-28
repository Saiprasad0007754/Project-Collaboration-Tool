const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator rule chains in a route definition.
 * If validation failed, forwards a formatted ApiError to the
 * global error handler instead of letting the controller run.
 *
 * Usage:
 *   router.post('/', [body('title').notEmpty()], validate, controllerFn);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  return next(ApiError.badRequest('Validation failed', formattedErrors));
};

module.exports = validate;
