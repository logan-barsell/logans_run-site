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
 * Safely convert various inputs to a Date, or null if invalid
 * @param {Date|number|string|null|undefined} value
 * @returns {Date|null}
 */
function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
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
  toDate,
  daysToSeconds,
  hoursToSeconds,
};
