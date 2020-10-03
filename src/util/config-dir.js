const { join } = require('path');

/**
 * Returns User-level configuration directory based on `platform`
 * @param {string} platform
 */
module.exports = (platform = process.platform) => {
  switch (platform) {
    case 'win32':
      return process.env.APPDATA;
    case 'darwin':
      return join(process.env.HOME, '/Library/Application Support');
    case 'linux':
      return process.env.XDG_CONFIG_HOME || join(process.env.HOME, '.config');
    default:
      return null;
  }
};
