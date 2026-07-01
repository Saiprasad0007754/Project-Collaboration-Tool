const express = require('express');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');
const validate = require('../middlewares/validate');
const {
  projectIdParam,
  createProjectRules,
  updateProjectRules,
} = require('../validators/project.validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

const router = express.Router();

// Every project route requires a valid Firebase ID token.
router.use(verifyFirebaseToken);

router.route('/').post(createProjectRules, validate, createProject).get(getProjects);

router
  .route('/:id')
  .get(projectIdParam, validate, getProjectById)
  .put(updateProjectRules, validate, updateProject)
  .delete(projectIdParam, validate, deleteProject);

module.exports = router;
