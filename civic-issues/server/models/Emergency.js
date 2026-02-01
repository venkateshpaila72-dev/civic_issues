const mongoose = require('mongoose');
const { EMERGENCY_TYPES, EMERGENCY_STATUS } = require('../utils/constants');

const emergencySchema = new mongoose.Schema(
  {
    // Emergency ID (auto-generated custom ID)
    emergencyId: {
      type: String,
      unique: true,
      index: true,
    },

    // Citizen who reported the emergency
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter reference is required'],
      index: true,
    },

    // Emergency Type
    type: {
      type: String,
      enum: Object.values(EMERGENCY_TYPES),
      required: [true, 'Emergency type is required'],
      index: true,
    },

    // Emergency Details
    title: {
      type: String,
      required: [true, 'Emergency title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Emergency description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Location (REQUIRED for emergencies)
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

    // Contact Information (for emergency response)
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required for emergencies'],
      trim: true,
    },

    // Media Attachments (optional for emergencies)
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

    // Emergency Status
    status: {
      type: String,
      enum: Object.values(EMERGENCY_STATUS),
      default: EMERGENCY_STATUS.REPORTED,
      index: true,
    },

    // Status History
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(EMERGENCY_STATUS),
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

    // Officer/Responder handling the emergency
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // Response Times
    receivedAt: {
      type: Date,
      default: null,
    },

    dispatchedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    // Priority Level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high', // Emergencies default to high priority
    },

    // Resolution Details
    resolutionNotes: {
      type: String,
      default: null,
    },

    // Casualties/Severity (optional)
    casualtiesReported: {
      type: Number,
      default: 0,
      min: 0,
    },

    severityLevel: {
      type: String,
      enum: ['minor', 'moderate', 'severe', 'critical'],
      default: 'moderate',
    },

    // Additional Notes
    officerNotes: {
      type: String,
      default: null,
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
emergencySchema.index({ reportedBy: 1, status: 1 });
emergencySchema.index({ type: 1, status: 1 });
emergencySchema.index({ respondedBy: 1, status: 1 });
emergencySchema.index({ emergencyId: 1 });
emergencySchema.index({ 'location.coordinates': '2dsphere' });
emergencySchema.index({ priority: 1, status: 1 });
emergencySchema.index({ createdAt: -1 });

// Pre-save middleware: Generate emergency ID
emergencySchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate emergencyId: EMR-TYPE-YYYYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get type prefix (first 3 letters)
    const typePrefix = this.type.substring(0, 3).toUpperCase();
    
    // Get count of emergencies today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    this.emergencyId = `EMR-${typePrefix}-${year}${month}${day}-${sequence}`;

    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      remarks: 'Emergency reported',
    });
  }
  next();
});

// Pre-save middleware: Update status history and timestamps
emergencySchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });

    // Set timestamps based on status
    const now = new Date();
    
    if (this.status === EMERGENCY_STATUS.RECEIVED && !this.receivedAt) {
      this.receivedAt = now;
    }
    
    if (this.status === EMERGENCY_STATUS.DISPATCHED && !this.dispatchedAt) {
      this.dispatchedAt = now;
    }
    
    if (this.status === EMERGENCY_STATUS.RESOLVED && !this.resolvedAt) {
      this.resolvedAt = now;
    }
  }
  next();
});

// Static method: Find emergencies by type
emergencySchema.statics.findByType = function (type, filters = {}) {
  return this.find({
    type,
    isDeleted: false,
    ...filters,
  })
    .populate('reportedBy', 'fullName email phoneNumber')
    .populate('respondedBy', 'fullName email')
    .sort({ createdAt: -1 });
};

// Static method: Find active emergencies
emergencySchema.statics.findActive = function () {
  return this.find({
    status: {
      $in: [
        EMERGENCY_STATUS.REPORTED,
        EMERGENCY_STATUS.RECEIVED,
        EMERGENCY_STATUS.DISPATCHED,
      ],
    },
    isDeleted: false,
  })
    .populate('reportedBy', 'fullName email phoneNumber')
    .populate('respondedBy', 'fullName email')
    .sort({ priority: -1, createdAt: -1 });
};

// Static method: Find emergencies by citizen
emergencySchema.statics.findByCitizen = function (citizenId, filters = {}) {
  return this.find({
    reportedBy: citizenId,
    isDeleted: false,
    ...filters,
  })
    .populate('respondedBy', 'fullName email')
    .sort({ createdAt: -1 });
};

// Static method: Find emergencies near location
emergencySchema.statics.findNearLocation = function (longitude, latitude, maxDistance = 5000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
    isDeleted: false,
  })
    .populate('reportedBy', 'fullName email phoneNumber')
    .populate('respondedBy', 'fullName email');
};

// Method: Check if emergency is active
emergencySchema.methods.isActive = function () {
  return (
    this.status !== EMERGENCY_STATUS.RESOLVED &&
    !this.isDeleted
  );
};

// Method: Update status with remarks
emergencySchema.methods.updateStatus = async function (newStatus, officerId, remarks = null) {
  this.status = newStatus;
  
  if (officerId && !this.respondedBy) {
    this.respondedBy = officerId;
  }

  if (remarks) {
    this.statusHistory[this.statusHistory.length - 1].remarks = remarks;
  }

  await this.save();
};

// Virtual: Response time (from reported to received)
emergencySchema.virtual('responseTime').get(function () {
  if (!this.receivedAt) return null;
  const diffMs = this.receivedAt - this.createdAt;
  const diffMinutes = Math.floor(diffMs / 60000);
  return diffMinutes;
});

// Virtual: Resolution time (from reported to resolved)
emergencySchema.virtual('resolutionTime').get(function () {
  if (!this.resolvedAt) return null;
  const diffMs = this.resolvedAt - this.createdAt;
  const diffMinutes = Math.floor(diffMs / 60000);
  return diffMinutes;
});

// Virtual: Total media count
emergencySchema.virtual('mediaCount').get(function () {
  return (
    (this.media.images?.length || 0) +
    (this.media.videos?.length || 0) +
    (this.media.audio?.length || 0)
  );
});

// Ensure virtuals are included in JSON
emergencySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

emergencySchema.set('toObject', {
  virtuals: true,
});

const Emergency = mongoose.model('Emergency', emergencySchema);

module.exports = Emergency;