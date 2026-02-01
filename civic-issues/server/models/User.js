const mongoose = require('mongoose');
const { USER_ROLES, ACCOUNT_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    // =====================
    // AUTH INFO
    // =====================
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      select: false, // never return password by default
      default: null,
    },

    googleId: {
      type: String,
      default: null,
      sparse: true, // Unique only for non-null values
      index: true,
    },

    authProvider: {
      type: String,
      enum: ['google', 'local'],
      default: 'local',
      index: true,
    },

    // =====================
    // BASIC INFO
    // =====================
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
    },

    // =====================
    // ROLE & STATUS
    // =====================
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CITIZEN,
      required: true,
      index: true,
    },

    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // =====================
    // OFFICER FIELDS
    // =====================
    assignedDepartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
      },
    ],

    // =====================
    // META
    // =====================
    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =====================
// INDEXES
// =====================
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1, accountStatus: 1 });
userSchema.index({ authProvider: 1 });
userSchema.index({ googleId: 1 });

// =====================
// VIRTUALS
// =====================
userSchema.virtual('fullAddress').get(function () {
  if (!this.address || !this.address.street) return null;
  const { street, city, state, pincode } = this.address;
  return `${street}, ${city}, ${state} - ${pincode}`;
});

// =====================
// METHODS
// =====================
userSchema.methods.isOfficer = function () {
  return this.role === USER_ROLES.OFFICER;
};

userSchema.methods.isAdmin = function () {
  return this.role === USER_ROLES.ADMIN;
};

userSchema.methods.isCitizen = function () {
  return this.role === USER_ROLES.CITIZEN;
};

userSchema.methods.isActive = function () {
  return this.accountStatus === ACCOUNT_STATUS.ACTIVE && !this.isDeleted;
};

userSchema.methods.isAssignedToDepartment = function (departmentId) {
  if (!this.isOfficer()) return false;
  return this.assignedDepartments.some(
    (dept) => dept.toString() === departmentId.toString()
  );
};

// =====================
// STATICS
// =====================
userSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });
};

userSchema.statics.findActiveByRole = function (role) {
  return this.find({
    role,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
    isDeleted: false,
  });
};

// =====================
// HOOKS
// =====================
userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// =====================
// TRANSFORMS
// =====================
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.googleId;
    delete ret.__v;
    return ret;
  },
});

userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);