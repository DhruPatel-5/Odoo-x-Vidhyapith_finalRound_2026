const { VERSION_PREFIX } = require('../config/constants');

/**
 * Increment the integer suffix of a version string.
 * @param {string} version - e.g. 'v1', 'v3'
 * @returns {string} - e.g. 'v2', 'v4'
 * @example bumpVersion('v1') // => 'v2'
 */
const bumpVersion = (version) => {
  if (!version || typeof version !== 'string') return `${VERSION_PREFIX}2`;
  const num = parseInt(version.replace(VERSION_PREFIX, ''), 10);
  if (isNaN(num)) return `${VERSION_PREFIX}2`;
  return `${VERSION_PREFIX}${num + 1}`;
};

/**
 * Parse a version string to its integer value.
 * @param {string} version - e.g. 'v3'
 * @returns {number} - e.g. 3
 */
const parseVersion = (version) => {
  if (!version) return 0;
  return parseInt(version.replace(VERSION_PREFIX, ''), 10) || 0;
};

module.exports = { bumpVersion, parseVersion };
