const Project = require('../models/Project.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

/**
 * Builds the embedded "user snapshot" sub-document from req.user
 * (attached by verifyFirebaseToken) for storing as createdBy / a member.
 */
const buildUserSnapshot = (user, role) => ({
  uid: user.uid,
  name: user.name || '',
  email: user.email || '',
  role,
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project. The authenticated user becomes the
 *          creator and is automatically added to members as 'owner'.
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, status, members = [] } = req.body;

  const creatorSnapshot = buildUserSnapshot(req.user, 'owner');

  // Merge any explicitly-provided members with the creator, de-duplicating by uid.
  const memberMap = new Map();
  memberMap.set(creatorSnapshot.uid, creatorSnapshot);
  members.forEach((member) => {
    if (member?.uid && !memberMap.has(member.uid)) {
      memberMap.set(member.uid, {
        uid: member.uid,
        name: member.name || '',
        email: member.email || '',
        role: member.role === 'owner' ? 'owner' : 'member',
      });
    }
  });

  const project = await Project.create({
    name,
    description,
    deadline: deadline || null,
    status,
    createdBy: creatorSnapshot,
    members: Array.from(memberMap.values()),
  });

  return new ApiResponse(201, project, 'Project created successfully.').send(res);
});

/**
 * @route   GET /api/projects
 * @desc    List all projects the authenticated user created or belongs to.
 *          Supports pagination (?page=&limit=) and optional ?status= filter.
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = { 'members.uid': req.user.uid };
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [projects, totalCount] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  const payload = {
    projects,
    pagination: buildPaginationMeta({ page, limit, totalCount }),
  };

  return new ApiResponse(200, payload, 'Projects fetched successfully.').send(res);
});

/**
 * Shared helper: loads a project by id and verifies the requesting user
 * is a member (which includes the creator, since they're auto-added).
 * Throws 404 if not found, 403 if found but the user has no access.
 */
const findAccessibleProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw ApiError.notFound('Project not found.');
  }

  const isMember = project.members.some((member) => member.uid === userId);
  if (!isMember) {
    throw ApiError.forbidden('You do not have access to this project.');
  }

  return project;
};

/**
 * @route   GET /api/projects/:id
 * @access  Private (creator or member)
 */
const getProjectById = asyncHandler(async (req, res) => {
  const project = await findAccessibleProject(req.params.id, req.user.uid);
  return new ApiResponse(200, project, 'Project fetched successfully.').send(res);
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project. Restricted to the creator (owner) only.
 * @access  Private (owner only)
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await findAccessibleProject(req.params.id, req.user.uid);

  if (project.createdBy.uid !== req.user.uid) {
    throw ApiError.forbidden('Only the project owner can update this project.');
  }

  const allowedFields = ['name', 'description', 'deadline', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  // Members are updated wholesale only if explicitly provided, and the
  // owner is always preserved regardless of what's sent.
  if (Array.isArray(req.body.members)) {
    const memberMap = new Map();
    memberMap.set(project.createdBy.uid, {
      uid: project.createdBy.uid,
      name: project.createdBy.name,
      email: project.createdBy.email,
      role: 'owner',
    });
    req.body.members.forEach((member) => {
      if (member?.uid && !memberMap.has(member.uid)) {
        memberMap.set(member.uid, {
          uid: member.uid,
          name: member.name || '',
          email: member.email || '',
          role: member.role === 'owner' ? 'owner' : 'member',
        });
      }
    });
    project.members = Array.from(memberMap.values());
  }

  await project.save();

  return new ApiResponse(200, project, 'Project updated successfully.').send(res);
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project. Restricted to the creator (owner) only.
 * @access  Private (owner only)
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await findAccessibleProject(req.params.id, req.user.uid);

  if (project.createdBy.uid !== req.user.uid) {
    throw ApiError.forbidden('Only the project owner can delete this project.');
  }

  await project.deleteOne();

  return new ApiResponse(200, { id: req.params.id }, 'Project deleted successfully.').send(res);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
