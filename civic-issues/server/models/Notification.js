const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Recipient User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    // Notification Type
    type: {
      type: String,
      enum: [
        'report_status_update',
        'report_assigned',
        'report_rejected',
        'report_resolved',
        'emergency_created',
        'emergency_status_update',
        'officer_assigned',
        'department_assigned',
        'account_status_change',
        'general',
      ],
      required: true,
      index: true,
    },

    // Notification Content
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },

    // Related Entity (report, emergency, etc.)
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['report', 'emergency', 'user', 'department', 'none'],
        default: 'none',
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },

    // Notification Status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Action Link (optional)
    actionUrl: {
      type: String,
      default: null,
    },

    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Expiry (optional - auto-delete after certain time)
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static method: Find unread notifications by user
notificationSchema.statics.findUnreadByUser = function (userId) {
  return this.find({
    user: userId,
    isRead: false,
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

// Static method: Get notification count by user
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    isDeleted: false,
  });
};

// Static method: Mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    {
      user: userId,
      isRead: false,
      isDeleted: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

// Method: Mark as read
notificationSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
};

// Method: Mark as unread
notificationSchema.methods.markAsUnread = async function () {
  if (this.isRead) {
    this.isRead = false;
    this.readAt = null;
    await this.save();
  }
};

// Virtual: Time since creation
notificationSchema.virtual('timeAgo').get(function () {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
  
  return 'Just now';
});

// Ensure virtuals are included in JSON
notificationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

notificationSchema.set('toObject', {
  virtuals: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;