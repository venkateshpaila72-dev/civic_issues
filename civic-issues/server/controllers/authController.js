const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
} = require('../utils/constants');
const { sanitizeUser } = require('../utils/helpers');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');
const generateToken = require('../utils/generateToken');

/**
 * =====================================================
 * MANUAL REGISTER (GMAIL + PASSWORD)
 * =====================================================
 * @desc    Register new user manually (gmail only)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { email, password, fullName, phoneNumber } = req.body;

    if (!email || !password || !fullName) {
      throw new AppError(
        ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!email.endsWith('@gmail.com')) {
      throw new AppError(
        'Only Gmail addresses are allowed',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      phoneNumber: phoneNumber || null,
      role: USER_ROLES.CITIZEN,
      authProvider: 'local',
      isActive: true,
    });

    const token = generateToken(user);

    logger.success(`Manual registration success: ${user.email}`);
    logger.auth('Manual Register', user.email, 'SUCCESS');

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    logger.error(`Manual register error: ${error.message}`);
    next(error);
  }
};

/**
 * =====================================================
 * MANUAL LOGIN (GMAIL + PASSWORD)
 * =====================================================
 * @desc    Login user manually
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || user.authProvider !== 'local') {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!user.isActive()) {
      throw new AppError(
        ERROR_MESSAGES.USER_INACTIVE,
        HTTP_STATUS.FORBIDDEN
      );
    }

    const token = generateToken(user);

    logger.success(`Manual login success: ${user.email}`);
    logger.auth('Manual Login', user.email, 'SUCCESS');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    logger.error(`Manual login error: ${error.message}`);
    next(error);
  }
};

/**
 * =====================================================
 * GOOGLE OAUTH CALLBACK
 * =====================================================
 * @desc    Handle Google OAuth success
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleOAuthSuccess = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const user = req.user;
    const token = generateToken(user);

    logger.success(`Google OAuth login success: ${user.email}`);
    logger.auth('Google OAuth Login', user.email, 'SUCCESS');

    return res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  } catch (error) {
    logger.error(`Google OAuth callback error: ${error.message}`);
    next(error);
  }
};

/**
 * =====================================================
 * GET CURRENT USER
 * =====================================================
 * @desc    Get logged-in user
 * @route   GET /api/auth/me
 * @access  Private (JWT)
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'assignedDepartments',
      'name code'
    );

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};

/**
 * =====================================================
 * LOGOUT
 * =====================================================
 * @desc    Logout user (client-side JWT)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    logger.auth('Logout', req.user.email, 'SUCCESS');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    next(error);
  }
};

/**
 * =====================================================
 * REFRESH USER DATA
 * =====================================================
 * @desc    Refresh user data
 * @route   POST /api/auth/refresh
 * @access  Private
 */
const refreshUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'assignedDepartments',
      'name code'
    );

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!user.isActive()) {
      throw new AppError(
        ERROR_MESSAGES.USER_INACTIVE,
        HTTP_STATUS.FORBIDDEN
      );
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User data refreshed',
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    logger.error(`Refresh user error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleOAuthSuccess,
  getCurrentUser,
  logout,
  refreshUser,
};
