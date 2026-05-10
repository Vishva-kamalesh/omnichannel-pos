/**
 * @description Wrapper function to catch async errors and pass them to global error handler
 * @param {Function} fn - Async function to be wrapped
 * @returns {Function} - Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = asyncHandler;
