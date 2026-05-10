const jwt = require("jsonwebtoken");

/**
 * @description Generates a JWT access token for a user
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

module.exports = generateToken;
