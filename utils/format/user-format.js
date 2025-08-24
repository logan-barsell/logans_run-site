/**
 * User formatting utilities
 */

/**
 * Formats a user object to exclude sensitive information
 * @param {Object} user - The user object to format
 * @returns {Object} Formatted user object without sensitive data
 */
function formatUser(user) {
  const {
    password,
    passwordHash,
    resetToken,
    resetTokenExpiry,
    ...secureUser
  } = user.toObject ? user.toObject() : user;

  return secureUser;
}

module.exports = {
  formatUser,
};
