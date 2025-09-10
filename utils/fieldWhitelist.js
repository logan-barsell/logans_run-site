/**
 * Utility for whitelisting fields from input data
 * @param {Object} data - Input data object
 * @param {Array} allowedFields - Array of allowed field names
 * @returns {Object} - Filtered object with only allowed fields
 */
function whitelistFields(data, allowedFields) {
  const filteredData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  }
  return filteredData;
}

module.exports = { whitelistFields };
