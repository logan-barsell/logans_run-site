/**
 * Date utility functions
 */

/**
 * Adds days to current date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Adds hours to current date
 * @param {number} hours - Number of hours to add
 * @returns {Date} New date
 */
function addHours(hours) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

/**
 * Adds minutes to current date
 * @param {number} minutes - Number of minutes to add
 * @returns {Date} New date
 */
function addMinutes(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

/**
 * Converts days to seconds
 * @param {number} days - Number of days
 * @returns {number} Seconds
 */
function daysToSeconds(days) {
  return days * 24 * 60 * 60;
}

/**
 * Converts hours to seconds
 * @param {number} hours - Number of hours
 * @returns {number} Seconds
 */
function hoursToSeconds(hours) {
  return hours * 60 * 60;
}

module.exports = {
  addDays,
  addHours,
  addMinutes,
  daysToSeconds,
  hoursToSeconds,
};
