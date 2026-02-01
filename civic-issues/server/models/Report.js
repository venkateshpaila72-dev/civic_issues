const mongoose = require('mongoose');
const { REPORT_STATUS, MEDIA_TYPES } = require('../utils/constants');

const reportSchema = new mongoose.Schema(
  {
    // Report ID (auto-generated custom ID)
    reportId: {
      type: String,
      unique: true,
      index: true,
    },

    // Citizen who created the report
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Citizen reference is required'],
      index: true,
    },

    // Department assigned to
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
      index: true,
    },

    // Report Details
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Location
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Location coordinates are required'],
        index: '2dsphere',
      },
      address: {
        type: String,
        default: null,
      },
      landmark: {
        type: String,
        default: null,
      },
    },

    // Media Attachments
    media: {
      images: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      videos: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      audio: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },

    // Report Status
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.SUBMITTED,
      index: true,
    },

    // Status History (track all status changes)
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(REPORT_STATUS),
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        remarks: {
          type: String,
          default: null,
        },
      },
    ],

    // Rejection Details (if status is rejected)
    rejectionReason: {
      type: String,
      default: null,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    // Officer handling the report
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // Priority (optional - for future use)
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    // Resolution Details
    resolvedAt: {
      type: Date,
      default: null,
    },

    resolutionNotes: {
      type: String,
      default: null,
    },

    // Citizen Feedback (optional - for future use)
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        default: null,
      },
      submittedAt: {
        type: Date,
        default: null,
      },
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
reportSchema.index({ citizen: 1, status: 1 });
reportSchema.index({ department: 1, status: 1 });
reportSchema.index({ assignedOfficer: 1, status: 1 });
reportSchema.index({ reportId: 1 });
reportSchema.index({ 'location.coordinates': '2dsphere' });
reportSchema.index({ createdAt: -1 });

// Pre-save middleware: Generate report ID
reportSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate reportId: RPT-YYYYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of reports today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    this.reportId = `RPT-${year}${month}${day}-${sequence}`;

    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      remarks: 'Report submitted',
    });
  }
  next();
});

// Pre-save middleware: Update status history
reportSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });

    // Set resolved timestamp
    if (this.status === REPORT_STATUS.RESOLVED && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }

    // Set rejected timestamp
    if (this.status === REPORT_STATUS.REJECTED && !this.rejectedAt) {
      this.rejectedAt = new Date();
    }
  }
  next();
});

// Static method: Find reports by citizen
reportSchema.statics.findByCitizen = function (citizenId, filters = {}) {
  return this.find({
    citizen: citizenId,
    isDeleted: false,
    ...filters,
  })
    .populate('department', 'name code')
    .populate('assignedOfficer', 'fullName email')
    .sort({ createdAt: -1 });
};

// Static method: Find reports by department
reportSchema.statics.findByDepartment = function (departmentId, filters = {}) {
  return this.find({
    department: departmentId,
    isDeleted: false,
    ...filters,
  })
    .populate('citizen', 'fullName email phoneNumber')
    .populate('assignedOfficer', 'fullName email')
    .sort({ createdAt: -1 });
};

// Static method: Find reports by officer
reportSchema.statics.findByOfficer = function (officerId, filters = {}) {
  return this.find({
    assignedOfficer: officerId,
    isDeleted: false,
    ...filters,
  })
    .populate('citizen', 'fullName email phoneNumber')
    .populate('department', 'name code')
    .sort({ createdAt: -1 });
};

// Method: Check if report can be updated
reportSchema.methods.canBeUpdated = function () {
  return (
    this.status !== REPORT_STATUS.RESOLVED &&
    this.status !== REPORT_STATUS.REJECTED &&
    !this.isDeleted
  );
};

// Method: Add status update
reportSchema.methods.updateStatus = async function (newStatus, officerId, remarks = null) {
  this.status = newStatus;
  
  if (officerId) {
    this.assignedOfficer = officerId;
  }

  if (remarks) {
    this.statusHistory[this.statusHistory.length - 1].remarks = remarks;
  }

  await this.save();
};

// Virtual: Total media count
reportSchema.virtual('mediaCount').get(function () {
  return (
    (this.media.images?.length || 0) +
    (this.media.videos?.length || 0) +
    (this.media.audio?.length || 0)
  );
});

// Virtual: Days since submission
reportSchema.virtual('daysSinceSubmission').get(function () {
  const diffTime = Math.abs(new Date() - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included in JSON
reportSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

reportSchema.set('toObject', {
  virtuals: true,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;