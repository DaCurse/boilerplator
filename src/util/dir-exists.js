const { existsSync, statSync } = require('fs');

/**
 * Checks if `path` exists and if it is a directory.
 * @param {string} path
 */
module.exports = (path) => existsSync(path) && statSync(path).isDirectory();
