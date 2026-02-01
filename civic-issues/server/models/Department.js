const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    // Department Name
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
      index: true,
    },

    // Department Code (auto-generated slug)
    code: {
      type: String,
      required: false,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Description
    description: {
      type: String,
      default: null,
      trim: true,
    },

    // Department Icon/Image (optional)
    icon: {
      type: String,
      default: null,
    },

    // Contact Information
    contactEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      default: null,
      trim: true,
    },

    // Department Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Statistics (updated periodically)
    stats: {
      totalReports: {
        type: Number,
        default: 0,
      },
      activeReports: {
        type: Number,
        default: 0,
      },
      resolvedReports: {
        type: Number,
        default: 0,
      },
      assignedOfficers: {
        type: Number,
        default: 0,
      },
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Created/Updated by (admin reference)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
departmentSchema.index({ name: 1, isActive: 1 });
departmentSchema.index({ code: 1 });
departmentSchema.index({ isDeleted: 1, isActive: 1 });

// Pre-save middleware: Generate department code from name
departmentSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('name')) {
    // Generate code from name (e.g., "Roads and Transport" -> "ROADS_TRANSPORT")
    this.code = this.name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '_') // Replace spaces with underscore
      .substring(0, 30); // Limit to 30 characters
  }
  next();
});

// Static method: Find active departments
departmentSchema.statics.findActive = function () {
  return this.find({
    isActive: true,
    isDeleted: false,
  }).sort({ name: 1 });
};

// Static method: Find department by code
departmentSchema.statics.findByCode = function (code) {
  return this.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });
};

// Static method: Find department by name
departmentSchema.statics.findByName = function (name) {
  return this.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    isDeleted: false,
  });
};

// Method: Check if department is active
departmentSchema.methods.isActiveDepartment = function () {
  return this.isActive && !this.isDeleted;
};

// Method: Increment report count
departmentSchema.methods.incrementReportCount = async function () {
  this.stats.totalReports += 1;
  this.stats.activeReports += 1;
  await this.save();
};

// Method: Update statistics
departmentSchema.methods.updateStats = async function (statsUpdate) {
  Object.assign(this.stats, statsUpdate);
  await this.save();
};

// Virtual: Display name with code
departmentSchema.virtual('displayName').get(function () {
  return `${this.name} (${this.code})`;
});

// Ensure virtuals are included in JSON
departmentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

departmentSchema.set('toObject', {
  virtuals: true,
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;