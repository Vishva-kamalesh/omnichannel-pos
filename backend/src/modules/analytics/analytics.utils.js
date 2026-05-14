/**
 * @description Generates date range for analytics queries
 * @param {string} type - daily, weekly, monthly, yearly
 * @returns {Object} { startDate, endDate }
 */
const getDateRange = (type) => {
  const now = new Date();
  let startDate = new Date();
  const endDate = new Date();

  switch (type) {
    case "daily":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "yearly":
      startDate.setFullYear(now.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setHours(0, 0, 0, 0);
  }

  return { startDate, endDate };
};

/**
 * @description Returns the group ID format for MongoDB aggregation based on interval
 * @param {string} interval - day, week, month, year
 * @returns {Object}
 */
const getGroupIdByInterval = (interval) => {
  switch (interval) {
    case "day":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    case "week":
      return {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
    case "month":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    case "year":
      return {
        year: { $year: "$createdAt" },
      };
    default:
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
  }
};

module.exports = {
  getDateRange,
  getGroupIdByInterval,
};
