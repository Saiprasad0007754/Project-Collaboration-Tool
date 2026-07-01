const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * A user "snapshot" embedded wherever a project references its creator
 * or members. There is no Mongo Users collection yet — Firebase is the
 * source of truth for identity — so a small denormalized copy of the
 * user's uid/name/email is stored directly on the project. This avoids
 * needing a join/population step that would otherwise require syncing
 * every Firebase user into Mongo.
 */
const memberSchema = new Schema(
  {
    uid: {
      type: String,
      required: [true, 'Member uid is required'],
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['owner', 'member'],
        message: 'Member role must be either "owner" or "member"',
      },
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'];

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name must be under 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be under 1000 characters'],
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: PROJECT_STATUSES,
        message: `Status must be one of: ${PROJECT_STATUSES.join(', ')}`,
      },
      default: 'planning',
    },
    createdBy: {
      type: memberSchema,
      required: [true, 'createdBy is required'],
    },
    members: {
      type: [memberSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

// Speeds up the common "projects I created or belong to" query used by GET /api/projects
projectSchema.index({ 'createdBy.uid': 1 });
projectSchema.index({ 'members.uid': 1 });

/**
 * Ensures the creator is always present in the members array as an
 * 'owner', even if the request body didn't explicitly include them.
 * Runs before both .save() and the controller's findOneAndUpdate-style
 * updates that re-validate (validators run on `create`/`save`).
 */
projectSchema.pre('save', function ensureOwnerInMembers(next) {
  const alreadyMember = this.members.some((member) => member.uid === this.createdBy.uid);
  if (!alreadyMember) {
    this.members.unshift({
      uid: this.createdBy.uid,
      name: this.createdBy.name,
      email: this.createdBy.email,
      role: 'owner',
      joinedAt: new Date(),
    });
  }
  next();
});

projectSchema.statics.STATUSES = PROJECT_STATUSES;

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
