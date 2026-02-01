const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Firebase Configuration (REST API - No Admin SDK)
 * This config is used to verify Firebase ID tokens via REST API
 */

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
};

/**
 * Verify Firebase ID Token using Firebase REST API
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<object>} - Decoded token data
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    // Firebase REST API endpoint for token verification
    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`;

    const response = await axios.post(verifyUrl, {
      idToken: idToken,
    });

    if (!response.data.users || response.data.users.length === 0) {
      throw new Error('Invalid token: User not found');
    }

    const user = response.data.users[0];

    // Return decoded user data
    return {
      uid: user.localId,
      email: user.email,
      emailVerified: user.emailVerified || false,
      displayName: user.displayName || null,
      photoURL: user.photoUrl || null,
      providerData: user.providerUserInfo || [],
    };
  } catch (error) {
    logger.error(`Firebase token verification error: ${error.message}`);
    
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    }
    
    throw new Error('Token verification failed');
  }
};

/**
 * Get user info from Firebase using ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<object>} - User information
 */
const getFirebaseUser = async (idToken) => {
  try {
    const userData = await verifyFirebaseToken(idToken);
    return userData;
  } catch (error) {
    logger.error(`Error fetching Firebase user: ${error.message}`);
    throw error;
  }
};

/**
 * Validate Firebase configuration
 * @returns {boolean} - Configuration validity
 */
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'projectId', 'authDomain'];
  const missingFields = [];

  requiredFields.forEach((field) => {
    if (!firebaseConfig[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    logger.error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
    return false;
  }

  logger.info('Firebase configuration validated successfully');
  return true;
};

module.exports = {
  firebaseConfig,
  verifyFirebaseToken,
  getFirebaseUser,
  validateFirebaseConfig,
};