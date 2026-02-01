const express = require('express');
const passport = require('passport');

// Controllers
const {
  register,
  login,
  googleOAuthSuccess,
  getCurrentUser,
  logout,
  refreshUser,
} = require('../controllers/authController');

// Middleware
const { authenticate } = require('../middleware/authMiddleware');

require('../config/passport');

const router = express.Router();

/**
 * =====================================================
 * MANUAL AUTH (GMAIL + PASSWORD)
 * =====================================================
 */

/**
 * @route   POST /api/auth/register
 * @desc    Manual registration using Gmail + password
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Manual login using Gmail + password
 * @access  Public
 */
router.post('/login', login);

/**
 * =====================================================
 * GOOGLE OAUTH ROUTES
 * =====================================================
 */

/**
 * @route   GET /api/auth/google
 * @desc    Redirect user to Google login
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleOAuthSuccess
);

/**
 * =====================================================
 * PROTECTED ROUTES (JWT)
 * =====================================================
 */

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (JWT-based, client-side)
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh user data
 * @access  Private
 */
router.post('/refresh', authenticate, refreshUser);

module.exports = router;
