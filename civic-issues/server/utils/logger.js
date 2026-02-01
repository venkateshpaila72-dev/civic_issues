const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

/**
 * Get current timestamp
 * @returns {string} - Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @returns {string} - Formatted message
 */
const formatMessage = (level, message) => {
  return `[${getTimestamp()}] [${level}] ${message}`;
};

/**
 * Logger utility
 */
const logger = {
  /**
   * Info level logging
   * @param {string} message - Log message
   */
  info: (message) => {
    console.log(
      `${colors.cyan}${formatMessage('INFO', message)}${colors.reset}`
    );
  },

  /**
   * Success level logging
   * @param {string} message - Log message
   */
  success: (message) => {
    console.log(
      `${colors.green}${formatMessage('SUCCESS', message)}${colors.reset}`
    );
  },

  /**
   * Warning level logging
   * @param {string} message - Log message
   */
  warn: (message) => {
    console.log(
      `${colors.yellow}${formatMessage('WARN', message)}${colors.reset}`
    );
  },

  /**
   * Error level logging
   * @param {string} message - Log message
   */
  error: (message) => {
    console.error(
      `${colors.red}${formatMessage('ERROR', message)}${colors.reset}`
    );
  },

  /**
   * Debug level logging (only in development)
   * @param {string} message - Log message
   */
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${colors.magenta}${formatMessage('DEBUG', message)}${colors.reset}`
      );
    }
  },

  /**
   * HTTP request logging
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @param {number} statusCode - Response status code
   * @param {number} responseTime - Response time in ms
   */
  http: (method, path, statusCode, responseTime) => {
    const statusColor = statusCode >= 400 ? colors.red : colors.green;
    const message = `${method} ${path} ${statusColor}${statusCode}${colors.reset} - ${responseTime}ms`;
    console.log(
      `${colors.blue}${formatMessage('HTTP', message)}${colors.reset}`
    );
  },

  /**
   * Database operation logging
   * @param {string} operation - Database operation
   * @param {string} collection - Collection name
   * @param {string} status - Operation status
   */
  db: (operation, collection, status = 'SUCCESS') => {
    const statusColor = status === 'SUCCESS' ? colors.green : colors.red;
    const message = `${operation} on ${collection} - ${statusColor}${status}${colors.reset}`;
    console.log(
      `${colors.cyan}${formatMessage('DB', message)}${colors.reset}`
    );
  },

  /**
   * Authentication logging
   * @param {string} action - Auth action
   * @param {string} user - User identifier
   * @param {string} status - Action status
   */
  auth: (action, user, status = 'SUCCESS') => {
    const statusColor = status === 'SUCCESS' ? colors.green : colors.red;
    const message = `${action} - User: ${user} - ${statusColor}${status}${colors.reset}`;
    console.log(
      `${colors.magenta}${formatMessage('AUTH', message)}${colors.reset}`
    );
  },
};

module.exports = logger;