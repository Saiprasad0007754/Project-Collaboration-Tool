const { body, param } = require('express-validator');
const Project = require('../models/Project.model');

/**
 * Shared rule: validates the :id route param is a well-formed Mongo ObjectId.
 * Used by GET/PUT/DELETE /api/projects/:id.
 */
const projectIdParam = [param('id').isMongoId().withMessage('Invalid project id.')];

/**
 * POST /api/projects
 * name and deadline/status/description/members are all optional except name.
 */
const createProjectRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Project name must be between 2 and 100 characters.'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be under 1000 characters.'),

  body('deadline')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date.')
    .custom((value) => new Date(value).getTime() > Date.now())
    .withMessage('Deadline must be a future date.'),

  body('status')
    .optional({ checkFalsy: true })
    .isIn(Project.STATUSES)
    .withMessage(`Status must be one of: ${Project.STATUSES.join(', ')}`),

  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array.'),

  body('members.*.uid')
    .optional()
    .isString()
    .withMessage('Each member must include a uid.'),

  body('members.*.email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Each member email must be valid.'),
];

/**
 * PUT /api/projects/:id
 * All fields optional since this is a partial-friendly update; whatever
 * is provided is validated, everything else is left untouched.
 */
const updateProjectRules = [
  ...projectIdParam,

  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Project name must be between 2 and 100 characters.'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be under 1000 characters.'),

  body('deadline')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Deadline must be a valid date.'),

  body('status')
    .optional({ checkFalsy: true })
    .isIn(Project.STATUSES)
    .withMessage(`Status must be one of: ${Project.STATUSES.join(', ')}`),

  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array.'),
];

module.exports = {
  projectIdParam,
  createProjectRules,
  updateProjectRules,
};
